var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./booking");
const  authMiddleware = require("../middlewares/auth.middleware");

var app = express();

app.use("/auth/", authRouter);
app.use("/booking/", authMiddleware.authenticate, bookRouter);

module.exports = app;