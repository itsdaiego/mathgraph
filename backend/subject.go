package main

import (
	"encoding/json"
	"log"
	"net/http"
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
