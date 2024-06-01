const Booking = require("../models/BookingModel");
const apiResponse = require("../helpers/apiResponse");
const User = require("../models/UserModel");

const BookingController = {
    // Booking List
    bookingList: async (req, res) => {
        try {
            const bookings = await Booking.find().populate("user", "firstName lastName");
            return apiResponse.successResponseWithData(res, "get bookings successfully", bookings);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    }
};

module.exports = BookingController;
