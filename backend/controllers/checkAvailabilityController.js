const CabBooking = require("../models/CabBookingModel");

const checkAvailabilityController = async (req, res) => {
  const { cabType, pickUpDate, pickUpStartTime, pickUpEndTime } = req.body;

  const dateString = pickUpDate; // MM-DD-YYYY format
  const startTimeString = pickUpStartTime; // HH:MM format
  const endTimeString = pickUpEndTime; // HH:MM format

  //   console.log(startTimeString, endTimeString);
  const [month, day, year] = dateString.split("-");
  const [startHour, startMinute] = startTimeString.split(":");
  const [endHour, endMinute] = endTimeString.split(":");

  // Convert requested time to milliseconds
  const requestedStartTimeMillis = new Date(
    year,
    month - 1,
    day,
    startHour,
    startMinute
  ).getTime();
  const requestedEndTimeMillis = new Date(
    year,
    month - 1,
    day,
    endHour,
    endMinute
  ).getTime();

  //   console.log(
  //     requestedEndTimeMillis,
  //     requestedEndTimeMillis,
  //     cabType,
  //     cabType.value
  //   );
  // Get existing bookings
  const existingBookings = await CabBooking.find({
    cabType: cabType.value,
  });
  //   console.log(existingBookings);
  let isAvailable = true;

  // Check each existing booking
  for (const booking of existingBookings) {
    const startTimeMillis = booking.startTime.getTime();
    const endTimeMillis = booking.endTime.getTime();

    // Check for overlap
    if (
      (startTimeMillis >= requestedStartTimeMillis &&
        startTimeMillis < requestedEndTimeMillis) ||
      (endTimeMillis > requestedStartTimeMillis &&
        endTimeMillis <= requestedEndTimeMillis) ||
      (startTimeMillis <= requestedStartTimeMillis &&
        endTimeMillis >= requestedEndTimeMillis)
    ) {
      // Overlap found, set availability to false and break loop
      isAvailable = false;
      break;
    }
  }

  // Respond based on availability
  if (isAvailable) {
    res.status(200).json({ message: "Cab is available" });
  } else {
    res.status(400).json({ message: "Cab is not available" });
  }
};

module.exports = checkAvailabilityController;
