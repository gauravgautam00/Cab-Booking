const express = require("express");

const router = express.Router();

const checkAvailabilityController = require("../controllers/checkAvailabilityController");

router.post("/availability", checkAvailabilityController);

module.exports = router;
