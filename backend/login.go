package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"time"

	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var loginReq LoginRequest

	err := json.NewDecoder(r.Body).Decode(&loginReq)
	if err != nil {
		log.Printf("Error decoding login request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	supabaseClient, err := createSupabaseClient()

	user, err := supabaseClient.Auth.SignInWithEmailPassword(loginReq.Email, loginReq.Password)
	if err != nil {
		log.Printf("Error logging in user: %v", err)
		http.Error(w, "Error logging in user", http.StatusUnauthorized)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.User.ID,
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	jwtSecret := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Error creating JWT token: %v", err)
		http.Error(w, "Error creating JWT token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    tokenString,
		Path:     "/",
		Domain:   "localhost",
		MaxAge:   60 * 60 * 24 * 7, // 7 days
		HttpOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: http.SameSiteLaxMode,
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
