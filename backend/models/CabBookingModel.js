const mongoose = require("mongoose");

const CabBookingModel = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  cabType: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("CabBooking", CabBookingModel);
