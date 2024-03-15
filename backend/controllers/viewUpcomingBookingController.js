const CabBooking = require("../models/CabBookingModel");

const viewUpcomingBookingController = async (req, res) => {
  const userEmail = req.query.userEmail;

  const nextBooking = [];
  const allBooking = await CabBooking.find({ userEmail });
  const curTimeMillis = new Date().getTime();
  allBooking.forEach((ele) => {
    const startTimeMillis = ele.startTime.getTime();
    if (startTimeMillis >= curTimeMillis) {
      nextBooking.push(ele);
    }
  });
  res.status(200).json({ nextBooking });
};
module.exports = viewUpcomingBookingController;
