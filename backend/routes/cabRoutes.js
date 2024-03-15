const express = require("express");

const router = express.Router();

const bookCabController = require("../controllers/bookCabController");
const viewPreviousBookingController = require("../controllers/viewPreviousBookingController");
const viewUpcomingBookingController = require("../controllers/viewUpcomingBookingController");
const deleteCabBookingController = require("../controllers/deleteCabBookingController");
const updateCabBookingController = require("../controllers/updateCabBookingController");
router.post("/book", bookCabController);
router.get("/previousBooking", viewPreviousBookingController);
router.get("/upcomingBooking", viewUpcomingBookingController);
router.delete("/deleteBooking/:bookingId", deleteCabBookingController);
router.put("/update/:bookingId", updateCabBookingController);

module.exports = router;
