package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/supabase-community/gotrue-go/types"
)

type SignupRequest struct {
  Email    string `json:"email"`
  Password string `json:"password"`
  Username string `json:"username"`
}

type Profile struct {
  ID       string `json:"id"`
  Username string `json:"username"`
}

type SignupWithData struct {
  Email    string `json:"email"`
  Password string `json:"password"`
  Data     map[string]interface{} `json:"data"`
}

type ErrorResponse struct {
  Error string `json:"error"`
}

type SuccessResponse struct {
  Message string `json:"message"`
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var signupReq SignupRequest
  err := json.NewDecoder(r.Body).Decode(&signupReq)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid request body"})
		return
	}

  supabaseClient, err := createSupabaseClient()
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
    json.NewEncoder(w).Encode(ErrorResponse{Error: "Error creating Supabase client"})
    return
  }

  user, err := supabaseClient.Auth.Signup(types.SignupRequest{
    Email:    signupReq.Email,
    Password: signupReq.Password,
    Data: map[string]interface{}{
        "username": signupReq.Username,
      },
  })

  if err != nil {
    log.Printf("Error signing up user: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    json.NewEncoder(w).Encode(ErrorResponse{Error: "Error signing up user"})
    return
  }

  var profile Profile

  _, err = supabaseClient.From("profiles").Insert(map[string]interface{}{
    "id":       user.ID,
    "username": signupReq.Username,
  }, false, `ON CONFLICT DO NOTHING`, `*`, `count`).ExecuteTo(&profile)

  if err != nil && err.Error() != "EOF" {
    log.Printf("Error creating user profile: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    json.NewEncoder(w).Encode(ErrorResponse{Error: "Error creating user profile"})
    return
  }

  w.WriteHeader(http.StatusCreated)
  json.NewEncoder(w).Encode(SuccessResponse{Message: "User signed up successfully"})
}
