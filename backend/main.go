package main

import (
  "log"
  "net/http"
)

func main() {
  http.HandleFunc("/api/login", loginHandler)
  http.HandleFunc("/api/signup", signupHandler)

  log.Println("Starting server on :8080")
  log.Fatal(http.ListenAndServe(":8080", nil))
}
