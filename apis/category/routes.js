const express = require("express");
const {
  getAllCategories,
  createNewCategory,
  deleteCategory,
} = require("./controllers");
const upload = require("../../middlewares/multer");
const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.post("/", upload.single("image"), createNewCategory);
categoryRouter.delete("/:_id", deleteCategory);
module.exports = categoryRouter;
