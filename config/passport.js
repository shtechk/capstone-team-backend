const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./strategies");

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

module.exports = passport;
