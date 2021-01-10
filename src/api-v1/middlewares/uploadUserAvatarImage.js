const multer = require("multer");

const storage = multer.memoryStorage();
const userAvatarUpload = multer({ storage: storage });

module.exports = userAvatarUpload;
