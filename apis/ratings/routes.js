const express = require("express");
const { addRating, getAllRatings } = require("./controllers");

const ratingRouter = express.Router();

// ratingRouter.post("/", addRating); // for this i need jwt
// ratingRouter.get("/", getAllRatings); // for this i don't need jwt bc all can view ratings

module.exports = ratingRouter;
