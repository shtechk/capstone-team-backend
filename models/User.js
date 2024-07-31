const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // User's unique username
  password: { type: String, required: true }, // User's password
  email: { type: String, required: true, unique: true }, // User's unique email
  first_name: { type: String, required: true }, // User's first name
  last_name: { type: String, required: true }, // User's last name
  profile_image: { type: String }, // URL to the user's profile image
  role: { type: String, enum: ["admin", "user", "business"], required: true }, // User's role (admin, user, or business)
  phone_number: { type: String, required: true, unique: true }, // User's phone number
  notification_token: { type: String },
  status: {
    type: String,
    enum: ["active", "pending", "rejected"],
    default: "active",
  }, // User's status
  business: [{ type: Schema.Types.ObjectId, ref: "Business" }], // References to businesses owned by the user
  booking: [{ type: Schema.Types.ObjectId, ref: "Booking" }], // References to bookings made by the user
  notification: [{ type: Schema.Types.ObjectId, ref: "Notification" }], // References to notifications received by the user
  voucher: [{ type: Schema.Types.ObjectId, ref: "Voucher" }], // References to vouchers sent/received by the user
  chat: [{ type: Schema.Types.ObjectId, ref: "Chat" }], // References to chats involving the user
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }], // References to the user's friends
  friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }], // References to friend requests sent by the user
  friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }], // References to friend requests received by the user
  createdAt: { type: Date, default: Date.now }, // Timestamp of user creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  verification_code: { type: String },
  is_verified: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
