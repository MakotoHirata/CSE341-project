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

module.exports = router;