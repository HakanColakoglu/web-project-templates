import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

const connectPostgres = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1); // Exit the process if PostgreSQL connection fails
  }
};

const closePostgres = async () => {
  try {
    await pool.end();
    console.log('PostgreSQL pool has ended');
  } catch (err) {
    console.error('Error during PostgreSQL disconnect:', err);
  }
};

export { pool, connectPostgres, closePostgres };