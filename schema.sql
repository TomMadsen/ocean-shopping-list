CREATE TABLE users(
uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
user_name VARCHAR(255) NOT NULL,
user_email VARCHAR(255) UNIQUE NOT NULL,
user_password VARCHAR(255) NOT NULL,
created_on DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE shopping_list(
item_id SERIAL PRIMARY KEY,
uid uuid REFERENCES users(uid),
item VARCHAR(255) NOT NULL,
category VARCHAR(255) NOT NULL,
created_on DATE NOT NULL DEFAULT NOW(),
list_id SERIAL,
obtained BOOLEAN NOT NULL DEFAULT FALSE 
);

