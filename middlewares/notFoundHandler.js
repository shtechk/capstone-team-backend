// middlewares/notFoundHandler.js
module.exports = (req, res, next) => {
  res.status(404);
  res.json({
    error: {
      message: "Not Found",
    },
  });
};
