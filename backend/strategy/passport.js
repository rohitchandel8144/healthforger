const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../db/models/user");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "love",
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.user._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
require('./googleStrategy')

module.exports = passport;