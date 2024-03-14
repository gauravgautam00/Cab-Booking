const CabBooking = require("../models/CabBookingModel");
const bookCabController = async (req, res) => {
  const {
    userEmail,
    source,
    destination,
    cabType,
    pickUpDate,
    pickUpstartTime,
    pickUpendTime,
    price,
  } = req.body;

  const dateString = pickUpDate; // MM/DD/YYYY format
  const startTimeString = pickUpstartTime; // HH:MM format
  const endTimeString = pickUpendTime; // HH:MM format

  if (!pickUpDate || !pickUpstartTime || !pickUpendTime) {
    res.status(404).json({ message: "Either date or time not found" });
  }
  const [month, day, year] = dateString.split("-");
  const [startHour, startMinute] = startTimeString.split(":");
  const [endHour, endMinute] = endTimeString.split(":");
  const startTime = new Date(year, month - 1, day, startHour, startMinute);
  const endTime = new Date(year, month - 1, day, endHour, endMinute);
  if (!endTime || !startTime) {
    res.status(500).json({
      message: "Some error occurred while configuring the format of date&time",
    });
  }

  const newBooking = await CabBooking.create({
    userEmail,
    source,
    destination,
    cabType,
    startTime,
    endTime,
    price,
  });

  if (!newBooking) {
    res
      .status(500)
      .json({ message: "Some error occurred while adding the new booking" });
  } else {
    res
      .status(200)
      .json({
        message: "Successfully booked the cab for this user",
        newBooking,
      });
  }
};
module.exports = bookCabController;
