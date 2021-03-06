const config = {
	PORT: process.env.PORT,
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	BLOG_IMAGES: process.env.BLOG_IMAGES,
	USER_IMAGES: process.env.USER_IMAGES,
	NODE_MAILER_EMAIL: process.env.NODE_MAILER_EMAIL,
	NODE_MAILER_PASSWORD: process.env.NODE_MAILER_PASSWORD,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
	FRONTEND_URL: process.env.FRONTEND_URL,
};

module.exports = { config };
