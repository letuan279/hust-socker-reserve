var express = require("express");
const InformationController = require("../controllers/InformationController");

var router = express.Router();
router.get("/", InformationController.getInfo);

module.exports = router;