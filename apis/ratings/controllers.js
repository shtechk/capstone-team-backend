const Place = require("../../models/Place");
const Rating = require("../../models/Rating");
const User = require("../../models/User");

// const getRatingsByPlace = async (coffeeId) => {
//    try{
//     const coffee= await Place.findById(coffeeId).populate("?")
//    }
// }

const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find().populate("user", "firstName");
    return res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

const addRating = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const newRating = await Rating.create(req.body);
    await Place.findByIdAndUpdate(req.body.place, {
      $push: { ratings: newRating },
    });
    await User.findByIdAndUpdate(req.body.user, {
      $push: { ratings: newRating },
    });
  } catch (error) {
    next(error);
  }
};

// const addRatingToPlace = async (req, res, next) => {
//   try {
//     const newRating = await Rating.create();
//     const { ratingId, placeId } = req.params;
//     await Rating.findByIdAndUpdate(ratingId, {
//       $push: { place: placeId },
//     });
//     await Place.findByIdAndUpdate(ratingId, {
//       $push: { ratings: ratingId },
//     });
//     return res.status(204).end();

//     // const userId = req.user._id;
//     // req.body.user = userId;
//     // const coffeeId = req.body.place;
//     // req.body.place = coffeeId;

//     // const newRating = await Rating.create(req.body);

//     // await User.findByIdAndUpdate(userId, {
//     //   $push: { ratings: newRating._id },
//     // });

//     // await Rating.findByIdAndUpdate(coffeeId,{
//     //     $push: {}
//     // })

//     // return res.status(202).json(newRating);
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { getAllRatings, addRating };
