CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price integer NOT NULL,
    category VARCHAR(50) NOT NULL
);