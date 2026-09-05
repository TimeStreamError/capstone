-- name: LoginViaEmail :one

SELECT *
FROM users
WHERE email=?1;