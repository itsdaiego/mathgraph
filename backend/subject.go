package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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


func subjectLessonHandler(w http.ResponseWriter, r *http.Request) {
  cookie, err := r.Cookie("session_token")
  if err != nil || cookie.Value == "" {
    log.Printf("Error getting session token cookie: %v", err)
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
    return
  }

  vars := mux.Vars(r)
  subjectId := vars["id"]
  lessonId := r.URL.Query().Get("lessonId")
  supabaseClient, err := createSupabaseClient()
  if err != nil {
    log.Printf("Error creating Supabase client: %v", err)
    http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
    return
  }


  var lessons []map[string]interface{}
  _, err = supabaseClient.From("lessons").Select("*", "count", false).Eq("subject_id", subjectId).Order("id", nil).ExecuteTo(&lessons)
  if err != nil {
    log.Printf("Error fetching lessons: %v", err)
    http.Error(w, "Failed to fetch lessons", http.StatusInternalServerError)
    return
  }

  if len(lessons) == 0 {
    http.Error(w, "Lesson not found", http.StatusNotFound)
    return
  }

  currentLessonIndex := -1
  for i, lesson := range lessons {
    if lesson["id"].(float64) == parseFloat(lessonId) {
      currentLessonIndex = i
      break
    }
  }

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
