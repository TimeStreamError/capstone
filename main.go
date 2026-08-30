package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/timestreamerror/capstone/internal/database"

	_ "modernc.org/sqlite"
)

type APIConfig struct {
	dbQueries *database.Queries
}

func main() {
	// load .env
	godotenv.Load()
	dbURL := os.Getenv("DB_FILE")
	if dbURL == "" {
		log.Fatal("Error: could not read env file")
	}
	// set up the apiConfig to pass around
	apiCfg := APIConfig{}
	db, err := sql.Open("sqlite", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	apiCfg.dbQueries = database.New(db)

	// basic http server
	r := chi.NewRouter()
	httpServer := http.Server{}

	// the various path handlers
	r.Handle("/*", http.FileServer(http.Dir(".")))
	r.Post("/api/quotes", apiCfg.handlePutQuote)
	r.Get("/api/import", apiCfg.handleImportCSV)
	r.Get("/api/quotes", apiCfg.handleGetAllQuotes)
	r.Get("/random", apiCfg.handleGetRandom)

	// boot up the server
	httpServer.Addr = ":8080"
	httpServer.Handler = r
	err = httpServer.ListenAndServe()
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
}
