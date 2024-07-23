const jwt = require("jsonwebtoken");

const generateToken = (userId, username, role) => {
  return jwt.sign({ id: userId, username, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
