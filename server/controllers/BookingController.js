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
    booking: async (req, res) => {
        try {
            const { userId, bookingDate, bookingTime, slot } = req.body;
            if (!userId || !bookingDate || !bookingTime || slot == null) {
                return apiResponse.ErrorResponse(res, "Missing required fields: userId, bookingDate, bookingTime, or slot");
            }

            const timeSlotEnum = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];
            if (!timeSlotEnum.includes(bookingTime)) {
                return apiResponse.ErrorResponse(res, "Invalid booking time");
            }

            const user = await User.findById(userId);
            if (!user) {
                return apiResponse.ErrorResponse(res, "User not found");
            }

             // Create a new booking
             const newBooking = new Booking({
                user: userId,
                bookingDate,
                bookingTime,
                bookingStatus: "PENDING", 
                slot
            });

            // Save the booking to the database
            const savedBooking = await newBooking.save();

            // const populatedBooking = await Booking.findById(savedBooking._id).populate("user", "firstName lastName");

            return apiResponse.successResponseWithData(res, "OK");
            
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    }
};

module.exports = BookingController;
