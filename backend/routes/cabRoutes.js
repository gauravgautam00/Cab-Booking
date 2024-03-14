const express = require("express");

const router = express.Router();

const bookCabController = require("../controllers/bookCabController");
const viewPreviousBookingController = require("../controllers/viewPreviousBookingController");
const viewUpcomingBookingController = require("../controllers/viewUpcomingBookingController");
router.post("/book", bookCabController);
router.post("/previousBooking", viewPreviousBookingController);
router.post("/upcomingBooking", viewUpcomingBookingController);

module.exports = router;
