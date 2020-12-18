const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { config } = require("./config");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let picDirectory;
    if (req.path != "/signUp") {
      picDirectory = path.join(
        __dirname,
        "..",
        "..",
        "..",
        config.RESOURCES,
        config.BLOG_IMAGES,
        req.headers.blogId
      );
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

const upload = multer({ storage });

module.exports = upload;
