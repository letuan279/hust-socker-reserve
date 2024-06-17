var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var timeSlotEnum = ["06_08", "08_10", "10_12", "12_14", "14_16", "16_18", "18_20"];
var typeEnum = ["Sân 1", "Sân 2", "Sân 3", "Sân 4"];

var BookingSchema = new Schema({
	date: { type: Date, required: true },
	timeSlot: {
		type: String,
		required: true,
		enum: timeSlotEnum
	},
	bookingStatus: {
		type: String,
		default: "PENDING", // PENDING, CONFIRMED, CANCELLED
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: typeEnum
	},
	note: { type: String },
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
