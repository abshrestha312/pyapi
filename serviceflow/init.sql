-- Initialize ServiceFlow database
CREATE DATABASE serviceflow;
CREATE USER serviceflow_user WITH PASSWORD 'serviceflow_password';
GRANT ALL PRIVILEGES ON DATABASE serviceflow TO serviceflow_user;