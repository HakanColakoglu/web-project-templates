import { Router } from 'express';

const router = Router();

// Simple public route
router.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Protected route that requires authentication
router.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`User: ${req.user.username}! Your session is active.`);
  } else {
    res.status(401).send('Unauthorized. Please log in.');
  }
});

export default router;
