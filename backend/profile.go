package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func getUserIdFromSessionToken(sessionToken string) (string, error) {
	godotenv.Load()
	token, err := jwt.Parse(sessionToken, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return "", fmt.Errorf("failed to parse token: %v", err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if userId, ok := claims["sub"].(string); ok {
			return userId, nil
		}
		return "", fmt.Errorf("sub not found in token claims")
	}

	return "", fmt.Errorf("invalid token")
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil || cookie.Value == "" {
		log.Printf("Error getting session token cookie: %v", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	supabaseClient, err := createSupabaseClient()
	if err != nil {
		log.Printf("Error creating Supabase client: %v", err)
		http.Error(w, "Error creating Supabase client", http.StatusInternalServerError)
		return
	}

	var profile Profile

	userId, err := getUserIdFromSessionToken(cookie.Value)
	if err != nil {
		log.Printf("Error getting user id from session token: %v", err)
		http.Error(w, "Error getting user id from session token", http.StatusUnauthorized)
		return
	}

	_, err = supabaseClient.From("profiles").Select("*", "count", false).Eq("id", userId).Single().ExecuteTo(&profile)
	if err != nil {
		log.Printf("Error getting profile: %v", err)
		http.Error(w, "Error getting profile", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(profile)
}
