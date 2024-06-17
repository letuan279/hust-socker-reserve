var express = require("express");
const BookingController = require("../controllers/BookingController");

var router = express.Router();

router.get("/", BookingController.bookingList);
router.post("/add", BookingController.bookingAdd);
router.get("/all", BookingController.bookingAll);
router.get("/approve/:id", BookingController.bookingApprove);
router.get("/cancel/:id", BookingController.bookingCancel);

module.exports = router;