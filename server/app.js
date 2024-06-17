let express = require("express");
require("dotenv").config();
let indexRouter = require("./routes/index");
let apiRouter = require("./routes/api");
let apiResponse = require("./helpers/apiResponse");
let cors = require("cors");
// DB connection
let mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL).then(() => {
	console.log("Database connected");
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;
