const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  RESOURCES: process.env.RESOURCES,
  BLOG_IMAGES: process.env.BLOG_IMAGES,
  USER_IMAGES: process.env.USER_IMAGES,
  NODE_MAILER_EMAIL: process.env.NODE_MAILER_EMAIL,
  NODE_MAILER_PASSWORD: process.env.NODE_MAILER_PASSWORD,
};

module.exports = { config };
