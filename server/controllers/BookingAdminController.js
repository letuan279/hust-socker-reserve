const Booking = require("../models/BookingModel");
const apiResponse = require("../helpers/apiResponse");

const BookingAdminController = {
    // Chấp nhận đặt sân
    acceptBooking: async (req, res) => {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                return apiResponse.validationErrorWithData(res, "Missing required field: bookingId");
            }

            // Tìm booking theo ID và cập nhật trạng thái thành 'ACCEPTED'
            const filter = { _id: bookingId };
            const updateDoc = { $set: { bookingStatus: "ACCEPTED" } };
            const options = { upsert: false };

            const result = await Booking.updateOne(filter, updateDoc, options);
            if (result.nModified === 0) {
                return apiResponse.notFoundResponse(res, "Booking not found or already accepted");
            }

            return apiResponse.successResponseWithData(res, "Booking accepted successfully", result);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    }
};

module.exports = BookingAdminController;
