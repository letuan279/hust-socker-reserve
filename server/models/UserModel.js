var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: {
		type: Number,
		default: 0, // 0: User, 1: Manager 
		required: true
	},
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
