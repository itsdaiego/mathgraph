package main

import (
  "encoding/json"
  "net/http"
  "os"

  "github.com/gorilla/mux"
  "github.com/nedpals/supabase-go"
)

type SignupRequest struct {
  Email    string `json:"email"`
  Password string `json:"password"`
  Username string `json:"username"`
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
  // Parse the request body
  var signupReq SignupRequest
  err := json.NewDecoder(r.Body).Decode(&signupReq)
  if err != nil {
    http.Error(w, "Invalid request body", http.StatusBadRequest)
    return
  }

  // Initialize Supabase client
  supabaseUrl := os.Getenv("SUPABASE_URL")
  supabaseKey := os.Getenv("SUPABASE_KEY")
  supabaseClient := supabase.CreateClient(supabaseUrl, supabaseKey)

  // Sign up the user
  user, err := supabaseClient.Auth.SignUp(supabase.UserCredentials{
    Email:    signupReq.Email,
    Password: signupReq.Password,
  })
  if err != nil {
    http.Error(w, "Error signing up user", http.StatusInternalServerError)
    return
  }

  // Create a profile for the user
  _, err = supabaseClient.From("profiles").Insert(map[string]interface{}{
    "id":       user.ID,
    "username": signupReq.Username,
  })
  if err != nil {
    http.Error(w, "Error creating user profile", http.StatusInternalServerError)
    return
  }

  // Return success response
  w.WriteHeader(http.StatusCreated)
  json.NewEncoder(w).Encode(map[string]string{"message": "User signed up successfully"})
}

func main() {
  r := mux.NewRouter()
  r.HandleFunc("/api/signup", signupHandler).Methods("POST")
  // ... other routes ...

  http.ListenAndServe(":8080", r)
}
