// const CabBooking = require("../models/CabBookingModel");
// const checkAvailabilityController = async (req, res) => {
//   const {
//     source,
//     destination,
//     cabType,
//     pickUpDate,
//     pickUpstartTime,
//     pickUpendTime,
//   } = req.body;

//   const dateString = pickUpDate; // MM-DD-YYYY format
//   const startTimeString = pickUpstartTime; // HH:MM format
//   const endTimeString = pickUpendTime; // HH:MM format

//   const [month, day, year] = dateString.split("-");
//   const [startHour, startMinute] = startTimeString.split(":");
//   const [endHour, endMinute] = endTimeString.split(":");
//   const requestedStartTime = new Date(
//     year,
//     month - 1,
//     day,
//     startHour,
//     startMinute
//   );
//   const requestedEndTime = new Date(year, month - 1, day, endHour, endMinute);
//   console.log(requestedEndTime.getTime());

//   const existingBookingOverlap = await CabBooking.findOne({
//     $and: [
//       // Check if the requested time frame overlaps with any existing booking
//       {
//         $or: [
//           // Case 1: Existing booking starts during requested time frame
//           {
//             startTime: { $gte: requestedStartTime },
//             startTime: { $lt: requestedEndTime },
//           },
//           // Case 2: Existing booking ends during requested time frame
//           {
//             endTime: { $gt: requestedStartTime },
//             endTime: { $lte: requestedEndTime },
//           },
//           // Case 3: Existing booking spans the entire requested time frame
//           {
//             startTime: { $lte: requestedStartTime },
//             endTime: { $gte: requestedEndTime },
//           },
//         ],
//       },
//       { cabType },
//     ],
//   });

//   if (!existingBookingOverlap) {
//     // console.log("Cab is available for the requested time frame");
//     res.status(200).json({ message: "Cab is  available" });
//   } else {
//     // console.log("Cab is not available for the requested time frame");
//     res.status(400).json({ message: "Cab is not available" });
//   }
// };
// module.exports = checkAvailabilityController;

const CabBooking = require("../models/CabBookingModel");

const checkAvailabilityController = async (req, res) => {
  const {
    source,
    destination,
    cabType,
    pickUpDate,
    pickUpstartTime,
    pickUpendTime,
  } = req.body;

  const dateString = pickUpDate; // MM-DD-YYYY format
  const startTimeString = pickUpstartTime; // HH:MM format
  const endTimeString = pickUpendTime; // HH:MM format

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

  // Get existing bookings
  const existingBookings = await CabBooking.find({ cabType });

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
