package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/supabase-community/supabase-go"
)

func createSupabaseClient() (*supabase.Client, error) {
	godotenv.Load()
	supabaseUrl := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	supabaseClient, err := supabase.NewClient(supabaseUrl, supabaseKey, &supabase.ClientOptions{})
	if err != nil {
		log.Printf("Error creating Supabase client: %v", err)
		return nil, err
	}

	return supabaseClient, nil
}
