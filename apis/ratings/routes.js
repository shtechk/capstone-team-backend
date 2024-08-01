const express = require("express");
const { addRating, getAllRatings } = require("./controllers");
const { ensureAuthenticated } = require("../../middlewares/auth");

const ratingRouter = express.Router();

ratingRouter.post("/Addrating", ensureAuthenticated, addRating); // for this i need jwt
ratingRouter.get("/Allratings/:_id", getAllRatings); // for this i don't need jwt bc all can view ratings

module.exports = ratingRouter;
