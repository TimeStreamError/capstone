-- +goose up
CREATE TABLE quotes (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    quote TEXT NOT NULL,
    author TEXT,
    last_served_at TIMESTAMP
);

-- +goose down
DROP TABLE quotes;