const CabBooking = require("../models/CabBookingModel");

const viewPreviousBookingController = async (req, res) => {
  const { userEmail } = req.body;

  const prevBooking = [];
  const allBooking = await CabBooking.find({ userEmail });

  const curTimeMillis = new Date().getTime();
  console.log(curTimeMillis);
  allBooking.forEach((ele) => {
    const endTimeMillis = ele.endTime.getTime();
    console.log(endTimeMillis);
    if (endTimeMillis < curTimeMillis) {
      prevBooking.push(ele);
    }
  });
  res.status(200).json({
    prevBooking,
  });
};
module.exports = viewPreviousBookingController;
