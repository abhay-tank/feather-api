const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { config } = require("../configuration/config");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");

const fileFilter = (req, file, cb) => {
	const validFileTypes = ["image/gif", "image/png", "image/jpeg", "image/jpg"];
	if (validFileTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new ErrorResponse(400, "unsuccessful", "Invalid file type."), false);
	}
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let picDirectory;
		if (req.route.path == "/") {
			picDirectory = path.join(
				__dirname,
				"..",
				"..",
				"..",
				config.RESOURCES,
				config.BLOG_IMAGES,
				req.headers.blogId
			);
		} else if (req.route.path == "/:id") {
			picDirectory = path.join(
				__dirname,
				"..",
				"..",
				"..",
				config.RESOURCES,
				config.BLOG_IMAGES,
				req.params.id
			);
			try {
				const oldPics = fs.readdirSync(picDirectory);
				oldPics.forEach((pic) => {
					fs.rmSync(path.join(picDirectory, pic));
				});
			} catch (error) {
				console.error(error);
			}
		} else {
			picDirectory = path.join(
				__dirname,
				"..",
				"..",
				config.RESOURCES,
				config.USER_IMAGES,
				req.body.uid
			);
		}
		const dirExists = fs.existsSync(picDirectory);
		if (!dirExists) {
			fs.mkdirSync(picDirectory);
		}
		return cb(null, picDirectory);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const blogImagesUpload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 10 },
	fileFilter: fileFilter,
}).array("blogImages", 10);

const uploadBlogImages = (req, res, next) => {
	blogImagesUpload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			console.error(err);
			return sendErrorResponse(
				new ErrorResponse(400, "unsuccessful", "Error uploading images"),
				res
			);
		} else if (err instanceof ErrorResponse) {
			console.error(err);
			return sendErrorResponse(err, res);
		} else if (err instanceof Error) {
			console.error(err);
			return sendErrorResponse(
				new ErrorResponse(500, "unsuccessful", "Error uploading images"),
				res
			);
		}
		next();
	});
};
module.exports = uploadBlogImages;
