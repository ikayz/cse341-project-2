const express = require('express');
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

const ensureOAuthConfigured = (req, res, next) => {
  if (req.app.locals.oauthConfigured) {
    return next();
  }

  return res.status(503).json({
    error:
      'GitHub OAuth is not configured. Set the GitHub OAuth environment variables.',
  });
};

const formatUser = user => ({
  id: user._id,
  displayName: user.displayName,
  username: user.username,
  email: user.email,
  photo: user.photo,
  provider: user.provider,
});

router.get(
  '/github',
  ensureOAuthConfigured,
  passport.authenticate('github', {
    scope: ['user:email'],
  }),
);

router.get(
  '/github/callback',
  ensureOAuthConfigured,
  passport.authenticate('github', {
    failureRedirect: '/auth/login-failed',
  }),
  (req, res) => {
    res.redirect('/auth/profile');
  },
);

router.get('/login-failed', (req, res) => {
  res.status(401).json({ error: 'GitHub OAuth login failed' });
});

router.get('/status', (req, res) => {
  res.json({
    authenticated: Boolean(req.isAuthenticated && req.isAuthenticated()),
    user:
      req.isAuthenticated && req.isAuthenticated() ? formatUser(req.user) : null,
  });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.json(formatUser(req.user));
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }

    req.session.destroy(sessionErr => {
      if (sessionErr) {
        return next(sessionErr);
      }

      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;
