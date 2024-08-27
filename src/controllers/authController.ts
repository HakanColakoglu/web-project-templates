import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../app';

// Sign-up function
export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    const newUser = result.rows[0];

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout function
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout' });
    }
    res.status(200).json({ message: 'User logged out successfully' });
  });
};
