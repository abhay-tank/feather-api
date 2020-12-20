const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");
const sendSuccessResponse = require("../middlewares/responses/sendSuccessResponse");
const { config } = require("../configuration/config");
const { verifyToken } = require("../helpers/jwtFunctions");
const User = require("../models/User");

const authIsUserSignedIn = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }
  let jwtToken = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = await verifyToken(jwtToken, config.JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next();
  }
  User.findOne({ email: decoded.email })
    .then((result) => {
      if (result) {
        if (!result.accountVerified) {
          return sendErrorResponse(
            new ErrorResponse(
              401,
              "unsuccessful",
              "User sign in using JWT. Please verify your account first"
            ),
            res
          );
        }
        req.currentUser = {
          userId: result.userId,
          firstName: result.firstName,
          email: result.email,
        };
        let showKeys = [
          "userId",
          "email",
          "firstName",
          "createdAt",
          "updatedAt",
        ];
        let signedInUser = {};
        showKeys.forEach((key) => (signedInUser[key] = result[key]));
        return sendSuccessResponse(
          "202",
          "successful",
          {
            jwt: jwtToken,
            data: signedInUser,
          },
          res
        );
      } else {
        throw new Error("Signup first");
      }
    })
    .catch((err) => {
      console.error(err);
      next();
    });
};

module.exports = authIsUserSignedIn;
