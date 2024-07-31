const express = require("express");
const {
  getAllPlaces,
  createNewPlace,
  deletePlace,
  searchPlaces,
  getOnePlace,
} = require("./controller");
const upload = require("../../middlewares/multer");
const placeRouter = express.Router();

placeRouter.get("/search", searchPlaces);
placeRouter.get("/:_id", getOnePlace);
placeRouter.get("/", getAllPlaces);
placeRouter.post("/", upload.single("images"), createNewPlace);
placeRouter.delete("/:_id", deletePlace);

module.exports = placeRouter;
