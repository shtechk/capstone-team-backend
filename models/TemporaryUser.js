const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TemporaryUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  profile_image: { type: String },
  phone_number: { type: String, required: true, unique: true },
  verification_code: { type: String, required: true },
  isBusiness: { type: Boolean, default: false },
  businessDetails: {
    name: { type: String },
    time: { type: String },
    date: { type: Date },
    location: { type: String },
    description: { type: String },
    image: { type: String },
    mode: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const TemporaryUser = mongoose.model("TemporaryUser", TemporaryUserSchema);
module.exports = TemporaryUser;
