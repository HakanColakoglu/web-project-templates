import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Redis and PostgreSQL clients with named imports
import { redisClient, connectRedis, closeRedis } from './config/redisClient';
import { pool, connectPostgres, closePostgres } from './config/postgresClient';
import { shutdownServices } from './utils/gracefulShutdown';

import passport from './config/passport'; // Import your passport configuration
import simpleSession from './config/session'; // Import your passport configuration

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
app.use(express.urlencoded({ extended: true }));

// Session management (using a simple session setup for demonstration)
app.use(simpleSession);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Only start the server if this module is the main module
// You don't have to do this but your test might have issues otherwise.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Initialize services
  connectRedis();
  connectPostgres();

  // Graceful shutdown
  shutdownServices(server, { closeRedis, closePostgres });
}

export { app, pool, redisClient, connectRedis, closeRedis, connectPostgres, closePostgres };