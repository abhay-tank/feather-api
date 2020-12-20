const express = require("express");
const authRouter = express.Router();
const createUserId = require("../middlewares/createUserId");
const userAvatarUpload = require("../middlewares/userAvatarUpload");
const {
  signUp,
  signIn,
  signOut,
  verifyUserAccount,
  requestVerificationEmail,
  changePassword,
} = require("../controllers/authController");
authRouter
  .route("/signUp")
  .post(createUserId, userAvatarUpload.single("avatarImage"), signUp);
authRouter.route("/signIn").post(signIn);
authRouter.route("/signOut").post(signOut);
authRouter
  .route("/verifyUserAccount/:verificationToken")
  .get(verifyUserAccount);
authRouter.route("/sendVerificationEmail/:id").get(requestVerificationEmail);
authRouter.route("/changePassword/:passwordChangeToken").patch(changePassword);

module.exports = authRouter;
