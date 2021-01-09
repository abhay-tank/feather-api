const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { config } = require("../configuration/config");

const storage = multer.memoryStorage();
const uploadBlogImages = multer({ storage });

module.exports = uploadBlogImages;
