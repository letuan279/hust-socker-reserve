const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const apiResponse = require('../helpers/apiResponse.js');

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const AuthenticateMiddleware = {
    authenticate: (req, res, next) => {
        const accessToken = req.headers["access-token"];
        if (accessToken) {
            jwt.verify(accessToken, accessTokenSecret, (err, user) => {
                if (err) {
                    console.log(err);
                    return apiResponse.tokenNotValid(res, "Token not valid!");
                }
                req.user = user;
                next();
            });
        } else {
            return apiResponse.unauthorizedResponse(res, "You're not authenticated!");
        }
    },
    refreshTokenMiddleware: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
                if (err) {
                    console.log(err);
                    return apiResponse.tokenNotValid(res, "Refresh token is not valid!");
                }

                req.user = user;
                next();
            });
        } else {
            return apiResponse.unauthorizedResponse(res, "You're not authenticated!");
        }
    },

    isAdmin: (req, res, next) => {
        const accessToken = req.headers["access-token"];
        if (accessToken) {
            jwt.verify(accessToken, accessTokenSecret, (err, user) => {
                if (err) {
                    console.err(err);
                    return apiResponse.tokenNotValid(res, "Token not valid!");
                }
                if (user.admin) {
                    next();
                } else {
                    return apiResponse.tokenNotValid(res, "You're not allowed request!");
                }
            });
        }
    },
};

module.exports = AuthenticateMiddleware;
