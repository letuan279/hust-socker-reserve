var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./booking");
var informationRouter = require("./information")

var app = express();

app.use("/auth/", authRouter);
app.use("/booking/", bookRouter);
app.use("/information", informationRouter)

module.exports = app;