import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Redis and PostgreSQL clients with named imports
import { redisClient, connectRedis, closeRedis } from './config/redisClient';
import { pool, connectPostgres, closePostgres } from './config/postgresClient';
import { shutdownServices } from './utils/gracefulShutdown';

import indexRoutes from './routes/index';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up logging
app.use(morgan('dev'));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Initialize services
connectRedis();
connectPostgres();

// Graceful shutdown
shutdownServices(server, { closeRedis, closePostgres });

export { app, pool, redisClient };