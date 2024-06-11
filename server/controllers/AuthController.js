const User = require("../models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const apiResponse = require("../helpers/apiResponse.js");
dotenv.config();

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const generateAccessToken = async (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        accessTokenSecret,
        { expiresIn: accessTokenLife }
    );
};

const generateRefreshToken = async (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        refreshTokenSecret,
        { expiresIn: refreshTokenLife }
    );
};

const AuthController = {
    signup: async (req, res) => {
        const { firstName, lastName, email, pwd } = req.body;
        let existUser;
        try {
            existUser = await User.findOne({ email });
            if (existUser) {
                return apiResponse.validationErrorWithData(
                    res,
                    "User already exists! Login instead"
                );
            }

            const hashedPassword = bcrypt.hashSync(pwd);
            const user = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            await user.save();

            const { password, ...others } = user._doc;
            return apiResponse.successResponseWithData(res, "", {
                user: others,
            });
        } catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, "Internal server error");
        }
    },

    login: async (req, res) => {
        const { email, pwd } = req.body;
        let user;
        try {
            user = await User.findOne({ email });
            if (!user) {
                return apiResponse(res, "Invalid email or password");
            }

            let isPasswordCorrect = bcrypt.compareSync(pwd, user.password);

            if (!isPasswordCorrect) {
                return apiResponse.validationErrorWithData(
                    res,
                    "Incorrect password!",
                    {}
                );
            }

            const accessToken = await generateAccessToken(user);
            const refreshToken = await generateRefreshToken(user);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict", // Ngăn chặn tấn công CSRF
            });

            user.refreshToken = refreshToken;
            await user.save();

            return apiResponse.successResponseWithData(res, {
                _id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                accessToken: accessToken,
            });
        } catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, "Internal server error");
        }
    },
    logout: async (req, res) => {
        res.clearCookie("refreshToken");
        await User.findByIdAndUpdate(req.user.id, {
            $set: { refreshToken: "" },
        })
            .then((user) => {
                if (!user) {
                    return apiResponse.notFoundResponse(res, "Not found user!");
                }

                return apiResponse.successResponse(res, "Log out!");
            })
            .catch((err) => {
                console.log(err);
                return apiResponse.ErrorResponse(res, "Internal server error");
            });
    },
    refreshToken: async (req, res) => {
        const refreshTokenFromClient = req.cookies.refreshToken;
        if (!refreshTokenFromClient) {
            return apiResponse.unauthorizedResponse(
                res,
                "You're not authenticated!"
            );
        }

        const existUser = await User.findOne({
            refreshToken: refreshTokenFromClient,
        });
        if (!existUser) {
            return apiResponse.tokenNotValid(
                res,
                "Not found refresh token for user!"
            );
        }

        const newAccessToken = await generateAccessToken(existUser);
        return apiResponse(res, "", { newAccessToken });
    },
};

module.exports = AuthController;
