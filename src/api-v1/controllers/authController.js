const User = require("../models/User");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("../middlewares/responses/sendErrorResponse");
const sendSuccessResponse = require("../middlewares/responses/sendSuccessResponse");
const { config } = require("../configuration/config");
const { generateToken } = require("../helpers/jwtFunctions");
const sendVerificationEmail = require("../helpers/sendVerificationEmail");
// POST "/signUp"
const signUp = (req, res) => {
  let newUserObject = {
    userId: req.headers.userId,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName || null,
    password: req.body.password,
  };
  if (req.file) {
    newUserObject.avatarImage = {
      avatarAlt: req.file.originalname.split(".")[0],
      avatarURL:
        req.protocol +
        "://" +
        req.get("host") +
        "/" +
        config.USER_IMAGES +
        "/" +
        req.headers.userId +
        "/" +
        req.file.filename,
    };
  }
  const newUser = new User(newUserObject);
  newUser
    .save()
    .then((result) => {
      if (!result) {
        sendErrorResponse(
          new ErrorResponse(500, "unsuccessful", "User not generated"),
          res
        );
      } else {
        let showKeys = [
          "userId",
          "firstName",
          "lastName",
          "email",
          "avatarImage",
          "createdAt",
          "updatedAt",
        ];
        let user = { accountVerified: false };
        showKeys.forEach((key) => {
          if (result[key]) {
            user[key] = result[key];
          }
        });
        const verificationURL =
          req.protocol +
          "://" +
          req.get("host") +
          "/auth/verifyUserAccount/" +
          result.accountVerificationToken;
        let verificationStatus = sendVerificationEmail(
          result.firstName,
          result.email,
          verificationURL
        );
        if (verificationStatus instanceof Error) {
          return sendErrorResponse(
            new ErrorResponse(
              500,
              "unsuccessful",
              "Error sending verification email"
            ),
            res
          );
        }
        sendSuccessResponse(200, "successful", user, res);
      }
    })
    .catch((err) => {
      console.error(err);
      sendErrorResponse(
        new ErrorResponse(400, "unsuccessful", err.toString()),
        res
      );
    });
};

// POST "/signIn"
const signIn = (req, res) => {
  // 	const jwtToken = await generateToken(
  // 	{
  // 		email: user.email,
  // 		userId: user.userId,
  // 	},
  // 	config.JWT_SECRET
  // );
};

// POST "/signOut"
const signOut = (req, res) => {};

// PATCH "/verifyUserAccount/:verificationToken"
const verifyUserAccount = (req, res) => {
  res.send("Verfied");
};

// PATCH "/changePassword/:passwordChangeToken"
const changePassword = (req, res) => {};

module.exports = { signUp, signIn, signOut, verifyUserAccount, changePassword };
