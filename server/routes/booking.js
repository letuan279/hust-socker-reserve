var express = require("express");
const BookingController = require("../controllers/BookingController");

var router = express.Router();

router.get("/", BookingController.bookingList);

module.exports = router;