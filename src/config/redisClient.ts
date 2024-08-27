import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Redis connection error:', err);
    process.exit(1); // Exit the process if Redis connection fails
  }
};

const closeRedis = async () => {
  try {
    await redisClient.quit();
    console.log('Redis client disconnected');
  } catch (err) {
    console.error('Error during Redis disconnect:', err);
  }
};

export { redisClient, connectRedis, closeRedis };