const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  RESOURCES: process.env.RESOURCES,
  BLOG_IMAGES: process.env.BLOG_IMAGES,
  USER_IMAGES: process.env.USER_IMAGES,
};

module.exports = { config };
