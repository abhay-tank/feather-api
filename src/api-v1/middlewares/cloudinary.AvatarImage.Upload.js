const { uploader } = require("cloudinary").v2;
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");
const uniqid = require("uniqid");
const cloudinaryAvatarImageUpload = (req, res, next) => {
	if (!req.file.buffer || req.file === undefined) {
		return sendErrorResponse(
			new ErrorResponse(400, "unsuccessful", "Profile Image not uploaded"),
			res
		);
	}
	uploader
		.upload(
			`data:${req.file.mimetype};base64,` + req.file.buffer.toString("base64"),
			{
				public_id: uniqid(),
				folder: "users/" + req.headers.userId,
			}
		)
		.then((data) => {
			req.body.image = data;
			next();
		})
		.catch((err) => {
			console.error(err);
			sendErrorResponse(
				new ErrorResponse(500, "unsuccessful", err.toString()),
				res
			);
		});
};

module.exports = cloudinaryAvatarImageUpload;
