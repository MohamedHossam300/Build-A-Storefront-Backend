CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(60) NOT NULL,
    password VARCHAR(200) NOT NULL
);