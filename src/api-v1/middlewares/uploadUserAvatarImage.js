const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { config } = require("../configuration/config");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const userPicDirectory = path.join(
			__dirname,
			"..",
			"..",
			"..",
			config.RESOURCES,
			config.USER_IMAGES,
			req.headers.userId
		);
		const dirExists = fs.existsSync(userPicDirectory);
		if (!dirExists) {
			fs.mkdirSync(userPicDirectory);
		}
		return cb(null, userPicDirectory);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const uploadUserAvatarImage = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 10 },
});

module.exports = { uploadUserAvatarImage };
