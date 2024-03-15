const express = require("express");

const router = express.Router();

const viewCabTypeController = require("../controllers/viewCabTypeController");
const editCabTypeController = require("../controllers/editCabTypeController");

router.get("/getTypes", viewCabTypeController);
router.put("/editTypes", editCabTypeController);

module.exports = router;
