-- name: PutQuote :one
INSERT INTO quotes (id, created_at, updated_at, quote, author, last_served_at)
VALUES (
    ?1,
    ?2,
    ?3,
    ?4,
    ?5,
    NULL
)
RETURNING *;