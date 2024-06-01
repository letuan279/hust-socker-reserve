var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var timeSlotEnum = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

var BookingSchema = new Schema({
	bookingDate: { type: Date, required: true },
	bookingTime: {
		type: String,
		required: true,
		enum: timeSlotEnum
	},
	bookingStatus: {
		type: String,
		default: "PENDING", // PENDING, CONFIRMED, CANCELLED
		required: true
	},
	slot: {
		type: Number, // 1, 2, 3, 4
		required: true
	},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
