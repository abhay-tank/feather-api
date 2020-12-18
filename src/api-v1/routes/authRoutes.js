const express = require("express");
const authRouter = express.Router();
const createUserId = require("../middlewares/createUserId");
const userAvatarUpload = require("../middlewares/userAvatarUpload");
const {
	signUp,
	signIn,
	signOut,
	verifyUserAccount,
	changePassword,
} = require("../controllers/authController");
authRouter
	.route("/signUp")
	.post(createUserId, userAvatarUpload.single("userAvatar"), signUp);
authRouter.route("/signIn").post(signIn);
authRouter.route("/signOut").post(signOut);
authRouter
	.route("/verifyUserAccount/:verificationToken")
	.patch(verifyUserAccount);
authRouter.route("/changePassword/:passwordChangeToken").patch(changePassword);

module.exports = authRouter;
