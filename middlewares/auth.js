const passport = require("passport");
require("../config/passport"); // Ensure the path is correct based on your project structure

const auth = passport.authenticate("jwt", { session: false });

const ensureAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  });
};

const ensureAuthenticated = (req, res, next) => {
  auth(req, res, () => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
};

const ensureBusiness = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === "business") {
      next();
    } else {
      console.log(`User role: ${req.user.role}`);
      res.status(403).json({ message: "Forbidden" });
    }
  });
};

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  ensureBusiness,
};
