var express = require("express");
var bookRouter = require("./booking");

var app = express();

app.use("/bookings/", bookRouter);

module.exports = app;