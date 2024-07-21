const mongoose = require("mongoose");
const RatingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
  mood: { type: Number },
  food: { type: Number },
  drinks: { type: Number },
  parking: { type: Number },
  service: { type: Number },
  note: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateTime: { type: Date.UTC },
});

module.exports = mongoose.model("Rating", RatingSchema);
