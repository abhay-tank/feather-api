const fs = require("fs");
const path = require("path");
const multer = require("multer");
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
    const userPicDirectory = path.join(
      __dirname,
      "..",
      "..",
      "..",
      config.RESOURCES,
      config.USER_IMAGES,
      req.headers.userId
    );
    const dirExists = fs.existsSync(userPicDirectory);
    if (!dirExists) {
      fs.mkdirSync(userPicDirectory);
    }
    return cb(null, userPicDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadUserAvatarImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
}).single("avatarImage");

const uploadNone = multer().none();

const userAvatarUpload = (req, res, next) => {
  if (req.path == "/signIn") {
    uploadNone(req, res, (err) => {
      next();
    });
  } else {
    uploadUserAvatarImage(req, res, (err) => {
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
  }
};

module.exports = userAvatarUpload;
