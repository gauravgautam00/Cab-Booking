const CabBooking = require("../models/CabBookingModel");

const viewPreviousBookingController = async (req, res) => {
  const userEmail = req.query.userEmail;

  const prevBooking = [];
  const allBooking = await CabBooking.find({ userEmail });
  const curTimeMillis = new Date().getTime();
  allBooking.forEach((ele) => {
    const endTimeMillis = ele.endTime.getTime();
    if (endTimeMillis < curTimeMillis) {
      prevBooking.push(ele);
    }
  });
  res.status(200).json({
    prevBooking,
  });
};
module.exports = viewPreviousBookingController;
