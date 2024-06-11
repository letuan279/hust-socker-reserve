var express = require("express");
const BookingController = require("../controllers/BookingController");

var router = express.Router();

router.get("/", BookingController.bookingList);
router.post("/cancel", BookingController.bookingCancel);
router.post("/add", BookingController.booking);

module.exports = router;