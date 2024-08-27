import session from 'express-session';
import dotenv from 'dotenv';
import RedisStore from 'connect-redis';
import { redisClient } from './redisClient';

dotenv.config();
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:", 
})

const simpleSession = session({
    store: redisStore,
    secret: process.env.SESSION_SECRET!, // Ensure you have a SESSION_SECRET in your .env file
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // Set cookie expiry to 1 day
    },
  });

  export default simpleSession;