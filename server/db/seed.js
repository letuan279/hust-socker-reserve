const User = require("../models/UserModel");
const Booking = require("../models/BookingModel");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define sample user data
const users = [
    {
        firstName: "Tuan",
        lastName: "Le",
        email: "tuan@example.com",
        password: "1234",
        role: 0,
    },
    {
        firstName: "Nghia",
        lastName: "Hoang",
        email: "nghia@example.com",
        password: "1234",
        role: 0,
    },
    {
        firstName: "Quang",
        lastName: "Pham",
        email: "quang@example.com",
        password: "1234",
        role: 1,
    },
];

// Define sample booking data
const bookings = [
    {
        bookingDate: new Date("2024-06-5"),
        bookingTime: "10:00 AM",
        bookingStatus: "PENDING",
        slot: 1,
    },
    {
        bookingDate: new Date("2024-06-4"),
        bookingTime: "2:00 PM",
        bookingStatus: "CONFIRMED",
        slot: 2,
    },
];

async function seedDatabase() {
    try {
        await User.deleteMany({});
        await User.insertMany(users);
        console.log("Users seeded successfully.");

        // Get user IDs
        const usersInStore = await User.find({});
        const userIds = usersInStore.map((user) => user._id);

        // Add user IDs to booking data
        bookings[0].user = userIds[0];
        bookings[1].user = userIds[1];

        await Booking.deleteMany({});
        await Booking.insertMany(bookings);
        console.log("Bookings seeded successfully.");

        mongoose.connection.close();

    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

seedDatabase();