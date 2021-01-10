const multer = require("multer");

const storage = multer.memoryStorage();
const uploadBlogImages = multer({ storage });

module.exports = uploadBlogImages;
