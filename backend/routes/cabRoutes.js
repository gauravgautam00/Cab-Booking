const express = require("express");

const router = express.Router();

const bookCabController = require("../controllers/bookCabController");
const viewPreviousBookingController = require("../controllers/viewPreviousBookingController");
router.post("/book", bookCabController);
router.post("/previousBooking", viewPreviousBookingController);

module.exports = router;
