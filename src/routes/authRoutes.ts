import { Router } from 'express';
import passport from 'passport';
import { signUp, logout } from '../controllers/authController';

const router = Router();

// Sign-up route
router.post('/signup', signUp);

// Sign-in route using passport
// If you set failureFlash to true, don't forget to use flash middleware, 
// otherwise tests will throw error.
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/signin',
  failureFlash: false,
}));

// Logout route
router.post('/logout', logout);

export default router;
