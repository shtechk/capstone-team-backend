const { model, Schema } = require("mongoose");

const ChatSchema = new Schema({
  place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  date: { type: Date, default: Date.now, required: true },
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Chat", ChatSchema);
