package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/timestreamerror/capstone/internal/database"
)

func (apiCfg *APIConfig) handlePutQuote(w http.ResponseWriter, r *http.Request) {

	data := Quote{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&data)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
	}

	dbParams := database.PutQuoteParams{}
	dbParams.ID, err = uuid.NewUUID()
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
	}
	dbParams.CreatedAt = time.Now()
	dbParams.UpdatedAt = time.Now()
	dbParams.Quote = data.Quotation
	if data.Author != "" {
		dbParams.Author.String = data.Author
		dbParams.Author.Valid = true
	} else {
		dbParams.Author.Valid = false
	}
	fmt.Println(dbParams.Quote)
	insertedRow, err := apiCfg.dbQueries.PutQuote(r.Context(), dbParams)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
	}
	fmt.Println(insertedRow)

	respondWithJSON(w, http.StatusOK, data)
}
