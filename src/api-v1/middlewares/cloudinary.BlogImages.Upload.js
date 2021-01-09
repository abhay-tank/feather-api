const { uploader } = require("cloudinary").v2;
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");
const blogImagesUpload = (req, res, next) => {
	console.log(req.files);
};

module.exports = blogImagesUpload;
