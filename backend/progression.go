package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type Progression struct {
	ProfileID string `json:"profile_id"`
	SubjectID int    `json:"subject_id"`
	LessonID  int    `json:"lesson_id"`
}

func progressionHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getProgressionHandler(w, r)
	case http.MethodPost:
		updateProgressionHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProgressionHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil || cookie.Value == "" {
		http.Error(w, "Session token not found or expired", http.StatusUnauthorized)
		return
	}

	userId, err := getUserIdFromSessionToken(cookie.Value)
	if err != nil {
		http.Error(w, "Error getting user id from session token", http.StatusUnauthorized)
		return
	}

	subjectId := r.URL.Query().Get("subjectId")
	if subjectId == "" {
		http.Error(w, "Subject ID is required", http.StatusBadRequest)
		return
	}

	supabaseClient, err := createSupabaseClient()
	if err != nil {
		http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
		return
	}

	var progression Progression
	_, err = supabaseClient.From("progression").Select("*", "count", false).
		Eq("profile_id", userId).
		Eq("subject_id", subjectId).
		Single().
		ExecuteTo(&progression)

	if err != nil {
		subjectIdInt, _ := strconv.Atoi(subjectId)
		newProgression := Progression{
			ProfileID: userId,
			SubjectID: subjectIdInt,
			LessonID:  1,
		}

		_, err = supabaseClient.From("progression").Insert(newProgression, false, "", "*", "count").ExecuteTo(&progression)
		if err != nil {
			http.Error(w, "Error creating progression", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(progression)
}

func updateProgressionHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil || cookie.Value == "" {
		http.Error(w, "Session token not found or expired", http.StatusUnauthorized)
		return
	}

	userId, err := getUserIdFromSessionToken(cookie.Value)
	if err != nil {
		http.Error(w, "Error getting user id from session token", http.StatusUnauthorized)
		return
	}

	var updateReq struct {
		SubjectID string `json:"subjectId"`
		LessonID  int `json:"lessonId"`
	}

	err = json.NewDecoder(r.Body).Decode(&updateReq)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	supabaseClient, err := createSupabaseClient()
	if err != nil {
		http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
		return
	}

	var updatedProgression Progression
	_, err = supabaseClient.From("progression").Update(map[string]interface{}{
		"lesson_id": updateReq.LessonID,
	}, "*", "count").
		Eq("profile_id", userId).
		Eq("subject_id", updateReq.SubjectID).
		ExecuteTo(&updatedProgression)

	if err != nil {
		log.Printf("Error updating progression: %v", err)
		http.Error(w, "Error updating progression", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedProgression)
}
