const mongoose = require("mongoose");

const cabTypeOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
  charge: { type: Number, required: true },
});

module.exports = mongoose.model("CabType", cabTypeOptionSchema);
