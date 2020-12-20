const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("./responses/sendErrorResponse");
const { config } = require("../configuration/config");
const { verifyToken } = require("../helpers/jwtFunctions");
const User = require("../models/User");

const protectRoute = async (req, res, next) => {
  if (!req.headers.authorization) {
    return sendErrorResponse(
      new ErrorResponse(401, "Unsuccessful", "Please login or signup"),
      res
    );
  }
  let jwtToken = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = await verifyToken(jwtToken, config.JWT_SECRET);
  } catch (err) {
    console.error(err);
    return sendErrorResponse(
      new ErrorResponse(401, "Unsuccesssul", "Invalid Token"),
      res
    );
  }
  User.findOne({ email: decoded.email })
    .then((result) => {
      if (result) {
        if (!result.accountVerified) {
          throw new ErrorResponse(
            401,
            "unsuccessful",
            "Please verify your account first"
          );
        }
        req.currentUser = {
          userId: result.userId,
          firstName: result.firstName,
          email: result.email,
        };
        next();
      } else {
        throw new ErrorResponse(401, "unsuccessful", "Signup or SignIn first");
      }
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof ErrorResponse) {
        return sendErrorResponse(err, res);
      }
      return sendErrorResponse(
        new ErrorResponse(500, "unsuccessful", err.toString()),
        res
      );
    });
};

module.exports = protectRoute;
