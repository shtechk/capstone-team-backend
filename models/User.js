const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  emailAddress: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "link", required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  vouchers: [{ type: Schema.Types.ObjectId, ref: "Voucher" }],
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  phoneNumber: { type: Number, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
});

module.exports = model("User", UserSchema);
