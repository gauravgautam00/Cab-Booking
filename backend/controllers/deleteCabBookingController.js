const CabBooking = require("../models/CabBookingModel");

const deleteCabBookingController = async (req, res) => {
  const bookingId = req.params.bookingId;

  const deletedBooking = await CabBooking.findByIdAndDelete({ _id: bookingId });
  console.log(deletedBooking);
  res
    .status(200)
    .json({ message: "Successfully deleted the booking", deletedBooking });
};
module.exports = deleteCabBookingController;
