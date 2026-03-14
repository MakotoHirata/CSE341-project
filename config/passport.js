const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

const hasGoogleConfig =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (hasGoogleConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const profileEmail = profile.emails?.[0]?.value?.toLowerCase();

          // Primary lookup by current schema.
          let user = await User.findOne({
            oauthProvider: 'google',
            oauthId: profile.id
          });

          // Backward compatibility for previously stored users.
          if (!user) {
            user = await User.findOne({
              $or: [
                { googleId: profile.id }, // legacy field from old schema
                ...(profileEmail ? [{ email: profileEmail }] : [])
              ]
            });
          }

          // Normalize/upgrade legacy user record.
          if (user) {
            user.name = profile.displayName || user.name;
            user.email = profileEmail || user.email;
            user.oauthProvider = 'google';
            user.oauthId = profile.id;
            await user.save();
            return done(null, user);
          }

          if (!user) {
            const safeEmail = profileEmail || `${profile.id}@google.local`;
            user = await User.create({
              name: profile.displayName || 'Google User',
              email: safeEmail,
              oauthProvider: 'google',
              oauthId: profile.id
            });
          }

          return done(null, user);
        } catch (error) {
          // Handle race condition on unique fields by loading the existing account.
          if (error?.code === 11000) {
            try {
              const profileEmail = profile.emails?.[0]?.value?.toLowerCase();
              const existingUser = await User.findOne({
                $or: [
                  { oauthProvider: 'google', oauthId: profile.id },
                  ...(profileEmail ? [{ email: profileEmail }] : [])
                ]
              });
              if (existingUser) {
                return done(null, existingUser);
              }
            } catch (lookupError) {
              return done(lookupError, null);
            }
          }
          return done(error, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = { hasGoogleConfig };
