package main

import (
	"fmt"
	"net/http"
)

func (apiCfg *APIConfig) handleGetRandom(w http.ResponseWriter, r *http.Request) {
	randomQuote, err := apiCfg.dbQueries.GetRandom(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
	}

	author := ""
	if randomQuote.Author.Valid {
		author = randomQuote.Author.String
	}

	fmt.Printf("%s\n\n-%s\n", randomQuote.Quote, author)

	data := Quote{}
	data.Quotation = randomQuote.Quote
	data.Author = author
	respondWithJSON(w, http.StatusOK, data)
}
