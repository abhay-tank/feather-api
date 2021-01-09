const { config: configuration } = require("../configuration/config");
const { config } = require("cloudinary").v2;
const cloudinaryConfig = (req, res, next) => {
	console.log();
	config({
		cloud_name: configuration.CLOUDINARY_CLOUD_NAME,
		api_key: configuration.CLOUDINARY_API_KEY,
		api_secret: configuration.CLOUDINARY_SECRET,
	});
	next();
};

module.exports = cloudinaryConfig;
