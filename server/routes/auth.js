var express = require("express");
const AuthController = require("../controllers/AuthController");
const AuthenticateMiddleware = require("../middlewares/auth.middleware");

var router = express.Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.get("/refresh-token", AuthenticateMiddleware.refreshTokenMiddleware, AuthController.refreshToken);
router.get("/logout", AuthenticateMiddleware.authenticate, AuthController.logout);
module.exports = router;