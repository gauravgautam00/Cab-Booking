const CabBooking = require("../models/CabBookingModel");

const updateCabBookingController = async (req, res) => {
  const id = req.params.bookingId;
  const updateData = req.body;
  console.log(updateData);

  const dateString = updateData.pickUpDate; // MM/DD/YYYY format
  const startTimeString = updateData.pickUpStartTime; // HH:MM format
  const endTimeString = updateData.pickUpEndTime; // HH:MM format
  if (
    !updateData.pickUpDate ||
    !updateData.pickUpStartTime ||
    !updateData.pickUpEndTime
  ) {
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
  const updatedBooking = await CabBooking.findByIdAndUpdate(
    { _id: id },
    {
      source: updateData.source,
      destination: updateData.destination,
      startTime,
      endTime,
      price: updateData.price,
      cabType: updateData.cabType.value,
    },
    { new: true }
  );

  if (!updatedBooking) {
    res
      .status(500)
      .json({ message: "Some error occurred while updating the booking" });
  } else {
    res.status(200).json(updatedBooking);
  }
};
module.exports = updateCabBookingController;
