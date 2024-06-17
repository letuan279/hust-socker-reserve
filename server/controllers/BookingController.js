const Booking = require("../models/BookingModel");
const apiResponse = require("../helpers/apiResponse");
const User = require("../models/UserModel");
const enums = require("../helpers/enums");
require("dotenv").config();

const BookingController = {
    // Booking List in week
    bookingList: async (req, res) => {
        try {
            const { start, end } = req.query;
            const bookings = await Booking.find({
                date: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            }).populate("user", "name phone email");
            return apiResponse.successResponseWithData(res, "get bookings successfully", bookings);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    },

    // Add new booking
    bookingAdd: async (req, res) => {
        const session = await Booking.startSession();
        session.startTransaction();

        try {
            let inforBooking = req.body
            // Validate booking
            if (!inforBooking.date || !inforBooking.timeSlot || !inforBooking.type) {
                return apiResponse.validationErrorWithData(res, "date, timeSlot, type are required", {});
            }

            // Check duplicate booking (date, timeSlot, type, user)
            const oldBooking = await Booking.findOne({
                date: inforBooking.date,
                timeSlot: inforBooking.timeSlot,
                type: inforBooking.type,
                user: process.env.USER_ID
            });

            if (oldBooking) {
                return apiResponse.validationErrorWithData(res, "Đã đặt sân này khung giờ này trước rổi, reload lại mà xem", {});
            }

            // Dựa vào Booking model để tạo mới một booking
            const booking = new Booking({
                date: inforBooking.date,
                timeSlot: inforBooking.timeSlot,
                bookingStatus: "PENDING",
                type: inforBooking.type,
                note: inforBooking.note,
                user: process.env.USER_ID
            });

            // Save booking
            const result = await booking.save({ session });
            await session.commitTransaction();
            session.endSession();

            return apiResponse.successResponseWithData(res, "add booking successfully", result);

        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    },

    bookingCancel: async (req, res) => {
        try {
            let inforBooking = req.body
            const filter = { _id: inforBooking["_id"], }
            const updateDoc = { $set: { bookingStatus: enums.BOOKING.CANCELLED } }
            const options = { upsert: true };
            const result = await Booking.updateOne(filter, updateDoc, options)
            return apiResponse.successResponseWithData(res, "cancel bookings successfully", result);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    },

    ///////////// For Admin
    bookingAll: async (req, res) => {
        try {
            const bookings = await Booking.find().populate("user", "name phone email");
            return apiResponse.successResponseWithData(res, "get bookings successfully", bookings);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    },

    bookingApprove: async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id);
            booking.bookingStatus = "CONFIRMED";
            const result = await booking.save();
            return apiResponse.successResponseWithData(res, "approve bookings successfully", result);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    },

    bookingCancel: async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id);
            booking.bookingStatus = "CANCELLED";
            const result = await booking.save();
            return apiResponse.successResponseWithData(res, "cancel bookings successfully", result);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    }
}

module.exports = BookingController;
