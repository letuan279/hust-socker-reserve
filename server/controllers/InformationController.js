const express = require("express");
const apiResponse = require("../helpers/apiResponse");

const InformationController = {
    // Get Information
    getInfo: (req, res) => {
        try {
            const info = {
                address: "A1 P. Lê Thanh Nghị, Bách Khoa, Hai Bà Trưng, Hà Nội",
                phone: "0123456789"
            };
            return apiResponse.successResponseWithData(res, "Information retrieved successfully", info);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err.message);
        }
    }
};

module.exports = InformationController;
