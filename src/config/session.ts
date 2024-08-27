import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();
const simpleSession = session({
    secret: process.env.SESSION_SECRET!, // Ensure you have a SESSION_SECRET in your .env file
    resave: false,
    saveUninitialized: false,
  });

  export default simpleSession;