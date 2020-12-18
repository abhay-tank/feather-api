const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { config } = require("./config");

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

const upload = multer({ storage });

module.exports = upload;
