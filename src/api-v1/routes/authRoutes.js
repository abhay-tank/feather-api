const express = require("express");
const authRouter = express.Router();

const {
  signUp,
  signIn,
  signOut,
  verifyUserAccount,
  changePassword,
} = require("../controllers/authController");
authRouter.route("/signUp").post(signUp);
authRouter.route("/signIn").post(signIn);
authRouter.route("/signOut").post(signOut);
authRouter
  .route("/verifyUserAccount/:verificationToken")
  .patch(verifyUserAccount);
authRouter.route("/changePassword/:passwordChangeToken").patch(changePassword);

module.exports = authRouter;
