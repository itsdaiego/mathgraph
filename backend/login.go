package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nedpals/supabase-go"
)

type LoginRequest struct {
  Email    string `json:"email"`
  Password string `json:"password"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
  var loginReq LoginRequest

  err := json.NewDecoder(r.Body).Decode(&loginReq)
  if err != nil {
    http.Error(w, "Invalid request body", http.StatusBadRequest)
    return
  }

  supabaseUrl := os.Getenv("SUPABASE_URL")
  supabaseKey := os.Getenv("SUPABASE_ANON_KEY")
  supabaseClient := supabase.CreateClient(supabaseUrl, supabaseKey)

  context := context.Background()

  user, err := supabaseClient.Auth.SignIn(context, supabase.UserCredentials{
    Email:    loginReq.Email,
    Password: loginReq.Password,
  })
  if err != nil {
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
    http.Error(w, "Error creating JWT token", http.StatusInternalServerError)
    return
  }

  http.SetCookie(w, &http.Cookie{
    Name:     "session_token",
    Value:    tokenString,
    Path:     "/",
    MaxAge:   60 * 60 * 24 * 7, // 7 days
    HttpOnly: true,
    Secure:   true,
    SameSite: http.SameSiteStrictMode,
  })

  w.WriteHeader(http.StatusOK)
  json.NewEncoder(w).Encode(map[string]string{"message": "Logged in successfully"})
}
