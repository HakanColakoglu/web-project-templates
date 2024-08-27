import { Router } from 'express';
import passport from 'passport';
import { signUp, logout } from '../controllers/authController';

const router = Router();

// Sign-up route
router.post('/signup', signUp);

// Sign-in route using passport
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/signin',
  failureFlash: true,
}));

// Logout route
router.post('/logout', logout);

export default router;
