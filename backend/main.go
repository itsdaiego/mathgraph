package main

import (
  "log"
  "net/http"
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    if r.Method == "OPTIONS" {
      return
    }
    next.ServeHTTP(w, r)
  }
}

func main() {
  http.HandleFunc("/api/login", corsMiddleware(loginHandler))
  http.HandleFunc("/api/signup", corsMiddleware(signupHandler))

  log.Println("Starting server on :8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}
