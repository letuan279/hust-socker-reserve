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
    },

    bookingCancel: async (req, res) => {
        try {
            let inforBooking = req.body
            const filter = { _id: inforBooking["_id"], }
            const updateDoc = { $set: { bookingStatus: "CANCELLED" } }
            const options = { upsert: true };
            const result = await Booking.updateOne(filter, updateDoc, options)
            return apiResponse.successResponseWithData(res, "cancel bookings successfully", result);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }

    }
};

module.exports = BookingController;
