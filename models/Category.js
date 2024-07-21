const { model, Schema } = require("mongoose");

const CategorySchema = new Schema({
  place: [{ type: Schema.Types.ObjectId, ref: "Place", required: true }],
  name: { type: String, required: true },
  image: { type: String, default: "link", required: true },
});

module.exports = model("Category", CategorySchema);
