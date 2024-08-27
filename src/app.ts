import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { Pool } from 'pg';

import session from 'express-session';
import passport from './config/passport'; // Import your passport configuration

// Import routes
import indexRoutes from './routes/index';
import authRoutes from './routes/authRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up logging
app.use(morgan('dev'));

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse x-www-form-urlencoded requests
app.use(express.urlencoded({ extended: true }));

// Initialize Redis client
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.connect()
  .then(() => console.log('Redis client connected'))
  .catch(err => console.error('Redis connection error:', err));

// Initialize PostgreSQL client
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Session management (using a simple session setup for demonstration)
app.use(session({
  secret: process.env.SESSION_SECRET!, // Ensure you have a SESSION_SECRET in your .env file
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());



// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app, pool, redisClient };
