package main

import (
	"log"
	"net/http"

	_ "modernc.org/sqlite"
)

func main() {

	// set up the apiConfig to pass around

	// load .env

	// basic http server
	httpServerHandler := http.NewServeMux()
	httpServer := http.Server{}

	// the various path handlers

	// boot up the server
	httpServer.Handler = httpServerHandler
	httpServer.Addr = ":8081"
	err = httpServer.ListenAndServe()
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

}
