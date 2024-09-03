const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../db/models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      prompt: 'select_account',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the same email already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If the user exists but doesn't have a googleId, link the account
          if (!user.googleId) {
            user.googleId = profile.id;
            user.profileLink = profile.photos[0].value;  // Save Google profile image in profileLink
            await user.save();
          }
        } else {
          // If the user does not exist, create a new one
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileLink: profile.photos[0].value,  // Save Google profile image in profileLink
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
