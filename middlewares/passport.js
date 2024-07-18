const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, next) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return next({ message: "Username or password is wrong!" });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword == false) {
        return next({ message: "Username or password is wrong!" });
      }
      next(false, user);
    } catch (error) {
      next(error);
    }
  }
);

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, next) => {
    if (Date.now() > payload.exp) {
      return next(null, false);
    }
    try {
      const user = await User.findById(payload._id);

      if (!user) {
        return next({ message: "User not found!" });
      }
      next(null, user);
    } catch (error) {
      next(error);
    }
  }
);
module.exports = { localStrategy, jwtStrategy };
