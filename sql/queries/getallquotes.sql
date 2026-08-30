-- name: GetAllQuotes :many
SELECT *
FROM quotes
ORDER BY created_at;