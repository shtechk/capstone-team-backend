const express = require("express");
const { addRating, getAllRatings } = require("./controllers");

const ratingRouter = express.Router();

ratingRouter.post("/", addRating);
ratingRouter.get("/", getAllRatings);

module.exports = ratingRouter;
