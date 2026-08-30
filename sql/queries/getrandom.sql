-- name: GetRandom :one
SELECT quote, author
FROM quotes
ORDER BY RANDOM()
LIMIT 1;