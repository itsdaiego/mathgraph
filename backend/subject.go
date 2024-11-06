package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/supabase-community/postgrest-go"
)

type Subject struct {
  ID          int32  `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
  Image       string `json:"image"`
}

func subjectHandler(w http.ResponseWriter, r *http.Request) {
  cookie, err := r.Cookie("session_token")
  if err != nil {
    log.Printf("Error getting session token cookie: %v", err)
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
    return
  }

  if cookie.Value == "" {
    log.Printf("No session token cookie")
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
    return
  }

  supabaseClient, err := createSupabaseClient()
  if err != nil {
    log.Printf("Error creating Supabase client: %v", err)
    http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
  }

  var subjects []Subject
  _, err = supabaseClient.From("subjects").Select("*", "count", false).ExecuteTo(&subjects)
  if err != nil {
    log.Printf("Error getting subjects: %v", err)
    http.Error(w, "Error getting subjects", http.StatusInternalServerError)
    return
  }

  w.WriteHeader(http.StatusOK)
  json.NewEncoder(w).Encode(subjects)
}

func subjectIdHandler(w http.ResponseWriter, r *http.Request) {
  cookie, err := r.Cookie("session_token")
  if err != nil || cookie.Value == "" {
    log.Printf("Error getting session token cookie: %v", err)
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
    return
  }

  vars := mux.Vars(r)

  subjectId := vars["subjectId"]

  supabaseClient, err := createSupabaseClient()
  if err != nil {
    log.Printf("Error creating Supabase client: %v", err)
    http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
    return
  }

  var subject Subject
  _, err = supabaseClient.From("subjects").Select("*", "count", false).Eq("id", subjectId).Single().ExecuteTo(&subject)

  fmt.Println("Subject: ", subject, subjectId)

  if err != nil {
    log.Printf("Error getting subject: %v", err)
    http.Error(w, "Error getting subject", http.StatusInternalServerError)
    return
  }

  w.WriteHeader(http.StatusOK)
  w.Header().Set("Content-Type", "application/json")

  json.NewEncoder(w).Encode(subject)
}


func subjectLessonHandler(w http.ResponseWriter, r *http.Request) {
  cookie, err := r.Cookie("session_token")
  if err != nil || cookie.Value == "" {
    log.Printf("Error getting session token cookie: %v", err)
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
    return
  }

  vars := mux.Vars(r)
  subjectId := vars["subjectId"]
  supabaseClient, err := createSupabaseClient()
  if err != nil {
    log.Printf("Error creating Supabase client: %v", err)
    http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
    return
  }


  orderOpts := postgrest.OrderOpts{
    Ascending:  true,
    NullsFirst: false,
  }

  var lessons []map[string]interface{}
  _, err = supabaseClient.From("lessons").Select("*", "count", false).Eq("subject_id", subjectId).Order("id", &orderOpts).ExecuteTo(&lessons)
  if err != nil {
    log.Printf("Error fetching lessons: %v", err)
    http.Error(w, "Failed to fetch lessons", http.StatusInternalServerError)
    return
  }

  if len(lessons) == 0 {
    http.Error(w, "Lesson not found", http.StatusNotFound)
    return
  }

  userId, err := getUserIdFromSessionToken(cookie.Value)


  var progression Progression
  _, err = supabaseClient.From("progression").Select("*", "count", false).Eq("profile_id", userId).Eq("subject_id", subjectId).Single().ExecuteTo(&progression)


  currentLessonIndex := progression.LessonID - 1

  fmt.Println("Current lesson", currentLessonIndex)

  if currentLessonIndex == -1 {
    http.Error(w, "Lesson not found", http.StatusNotFound)
    return
  }

  currentLesson := lessons[currentLessonIndex]
  var nextLessonId, prevLessonId interface{}

  if currentLessonIndex < len(lessons)-1 {
    nextLessonId = lessons[currentLessonIndex+1]["id"]
  }
  if currentLessonIndex > 0 {
    prevLessonId = lessons[currentLessonIndex-1]["id"]
  }

  response := map[string]interface{}{
    "lesson":       currentLesson,
    "nextLessonId": nextLessonId,
    "prevLessonId": prevLessonId,
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(response)
}

func parseFloat(s string) float64 {
  f, _ := strconv.ParseFloat(s, 64)
  return f
}
