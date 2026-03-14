const router = require('express').Router();
const passport = require('passport');
const { hasGoogleConfig } = require('../config/passport');

router.get('/google', (req, res, next) => {
  if (!hasGoogleConfig) {
    return res.status(500).json({ message: 'Google OAuth is not configured' });
  }

  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!hasGoogleConfig) {
    return res.status(500).json({ message: 'Google OAuth is not configured' });
  }

  return passport.authenticate('google', { failureRedirect: '/auth/google' })(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }

    // Ensure session persistence before responding.
    req.session.save((error) => {
      if (error) {
        return next(error);
      }

      return res.status(200).json({ message: 'Login successful', user: req.user });
    });
  });
});

router.get('/logout', (req, res, next) => {
  if (!req.logout) {
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  req.logout((error) => {
    if (error) {
      return next(error);
    }

    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      });
      return;
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }

  return res.status(200).json({
    authenticated: true,
    user: req.user
  });
});

module.exports = router;
