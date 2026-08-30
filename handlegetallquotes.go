package main

import (
	"html/template"
	"net/http"
)

func (apiCfg *APIConfig) handleGetAllQuotes(w http.ResponseWriter, r *http.Request) {

	records, err := apiCfg.dbQueries.GetAllQuotes(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
	}

	var tmplFile = "allquotes.tmpl"
	tmpl, err := template.New(tmplFile).ParseFiles(tmplFile)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	err = tmpl.Execute(w, records)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
}
