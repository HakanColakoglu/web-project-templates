-- init.sql

-- Step 1: Create a new database, you can handle this 
-- in docker-compose file too by setting POSTGRES_USER
CREATE DATABASE your_db_name;

-- Step 2: Create a new role (user) with a password, you can handle this 
-- in docker-compose file too by setting POSTGRES_PASSWORD
CREATE ROLE your_db_user WITH LOGIN PASSWORD 'your_db_password';

-- Step 3: Grant privileges to the new user on the new database
GRANT ALL PRIVILEGES ON DATABASE "your_db_name" TO your_db_user;

-- Step 4: Connect to the newly created database
\c your_db_name;

-- Step 5: Create the users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
  role VARCHAR(100) NOT NULL
);

-- Step 6: Grant privileges on the users table to the new user
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO your_db_user;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO your_db_user;