package main

import (
  "log"
  "github.com/supabase-community/supabase-go"
  "os"
)


func createSupabaseClient()  (*supabase.Client, error) {
	supabaseUrl := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	supabaseClient, err := supabase.NewClient(supabaseUrl, supabaseKey, &supabase.ClientOptions{})
  if err != nil {
    log.Printf("Error creating Supabase client: %v", err)
    return nil, err
  }

  return supabaseClient, nil
}
