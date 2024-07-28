const Category = require("../../models/Category");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
    console.log(categories);
  } catch (error) {
    next(error);
  }
};

const createNewCategory = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path.replace(/\\/g, "/");
    }
    const newCategory = await Category.create(req.body);
    return res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params._id;
    await Category.findByIdAndDelete(id);
  } catch (error) {
    next(error);
  }
  return res.status(200).json({ message: "category deleted succsessfully" });
};
module.exports = { getAllCategories, createNewCategory, deleteCategory };
