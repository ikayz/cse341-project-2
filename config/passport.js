const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const configurePassport = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } =
    process.env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
    console.warn(
      'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL.',
    );
    return false;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const photo = profile.photos?.[0]?.value;

          const user = await User.findOneAndUpdate(
            { githubId: profile.id },
            {
              githubId: profile.id,
              displayName: profile.displayName,
              username: profile.username,
              email,
              photo,
              provider: profile.provider,
            },
            { new: true, upsert: true, runValidators: true },
          );

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      },
    ),
  );

  return true;
};

module.exports = configurePassport;
