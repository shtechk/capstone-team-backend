const Place = require("../../models/Place");

const getOnePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    res.json(place);
  } catch (error) {
    next(error);
  }
};

const getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();
    return res.status(200).json(places);
  } catch (error) {
    next(error);
  }
};
const createNewPlace = async (req, res, next) => {
  try {
    // any where where I wont to create any thig that contain image i have to copy -paste this code 'if()'
    if (req.file) {
      req.body.images = req.file.path.replace(/\\/g, "/");
    }
    const newPlace = await Place.create(req.body);
    return res.status(201).json(newPlace);
  } catch (error) {
    next(error);
  }
};

const deletePlace = async (req, res, next) => {
  try {
    const id = req.params._id;
    await Place.findByIdAndDelete(id);
  } catch (error) {
    next(error);
  }
  return res.status(200).json({ message: "place deleted succsessfully" });
};
// endpoint for search
const searchPlaces = async (req, res, next) => {
  try {
    console.log(req.query);
    const searchTerm = req.query.search;
    const places = await Place.find({
      $or: [
        { name: new RegExp(searchTerm, "i") },
        { mood: new RegExp(searchTerm, "i") },
        // { service: new RegExp(searchTerm, "i") },
        // { food: new RegExp(searchTerm, "i") },
        // { drinks: new RegExp(searchTerm, "i") },
        // Add other fields you want to search by
      ],
    });
    res.status(200).json(places);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getOnePlace,
  getAllPlaces,
  createNewPlace,
  deletePlace,
  searchPlaces,
};
