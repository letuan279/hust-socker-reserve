let express = require("express");
let path = require("path");
let logger = require("morgan");
require("dotenv").config();
let indexRouter = require("./routes/index");
let apiRouter = require("./routes/api");
let apiResponse = require("./helpers/apiResponse");
let cors = require("cors");
let seeed= require("./db/seed");
// DB connection
let MONGODB_URL = "mongodb://localhost:27017/soccer";
let mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	//don't show the log when it is test
	if (process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
let db = mongoose.connection;

let app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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

// seeed()
module.exports = app;
