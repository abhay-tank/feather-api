const uniqid = require("uniqid");
const { uploader } = require("cloudinary").v2;
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");
const blogImagesUpload = (req, res, next) => {
	if (!req.files.length) {
		return sendErrorResponse(
			new ErrorResponse(400, "unsuccessful", "Blog Images not uploaded"),
			res
		);
	}
	let images = [];
	try {
		images = req.files.map((image) => {
			return uploader.upload(
				`data:${image.mimetype};base64,` + image.buffer.toString("base64"),
				{
					public_id: uniqid(),
					folder: "blogs/" + req.headers.blogId,
				}
			);
		});
	} catch (error) {
		console.error(error);
		return sendErrorResponse(
			new ErrorResponse(500, "unsuccessful", error.toString()),
			res
		);
	}
	Promise.all(images)
		.then((uploadedImages) => {
			req.body.images = uploadedImages;
			next();
		})
		.catch((error) => {
			console.error(error);
			return sendErrorResponse(
				new ErrorResponse(500, "unsuccessful", error.toString()),
				res
			);
		});
};

module.exports = blogImagesUpload;
