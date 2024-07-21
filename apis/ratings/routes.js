const express = require("express");

const ratingRouter = express.Router();

ratingRouter.post("/", addRating);
ratingRouter.get("/", getAllRatings);

module.exports = ratingRouter;
