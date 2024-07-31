module.exports = (err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};
