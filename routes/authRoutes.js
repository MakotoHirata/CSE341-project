const router = require('express').Router();
const passport = require('passport');

// Google login
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
    failureRedirect: '/'}),
    (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
}
);

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

router.get('/me', (req, res) => {
    if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
}
res.json(req.user);
});

module.exports = router;