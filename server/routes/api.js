var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./booking");

var app = express();

app.use("/auth/", authRouter);
app.use("/booking/", bookRouter);

module.exports = app;