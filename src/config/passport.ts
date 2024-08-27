import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { pool } from '../app';

interface User {
  id: number;
  username: string;
  password: string;
}

// Configure Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        // Fetch user from the database
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user: User = result.rows[0];

        if (!user) {
          return done(null, false, { message: 'Invalid username or password.' });
        }

        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid username or password.' });
        }

        // If credentials are valid, return the user object
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user to store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user to fetch user object from the user ID stored in session
passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user: User = result.rows[0];
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
