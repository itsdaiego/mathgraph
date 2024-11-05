package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
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
	r := mux.NewRouter()

	r.HandleFunc("/api/login", corsMiddleware(loginHandler)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/signup", corsMiddleware(signupHandler)).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/subjects", corsMiddleware(subjectHandler)).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/profile", corsMiddleware(profileHandler)).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/subjects/{subjectId}", corsMiddleware(subjectIdHandler)).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/subjects/{subjectId}/lessons/{lessonId}", corsMiddleware(subjectLessonHandler)).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/progression", corsMiddleware(progressionHandler)).Methods("GET", "POST", "OPTIONS")

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
