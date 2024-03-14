const CabBooking = require("../models/CabBookingModel");

const viewUpcomingBookingController = async (req, res) => {
  const { userEmail } = req.body;

  const prevBooking = [];
  const allBooking = await CabBooking.find({ userEmail });

  const curTimeMillis = new Date().getTime();
  console.log(curTimeMillis);
  allBooking.forEach((ele) => {
    const startTimeMillis = ele.startTime.getTime();
    console.log(startTimeMillis);
    if (startTimeMillis > curTimeMillis) {
      prevBooking.push(ele);
    }
  });
  res.status(200).json({ prevBooking });
};
module.exports = viewUpcomingBookingController;
