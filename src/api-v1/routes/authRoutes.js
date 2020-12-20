const express = require("express");
const authRouter = express.Router();
const createUserId = require("../middlewares/createUserId");
const {
	uploadUserAvatarImage,
} = require("../middlewares/uploadUserAvatarImage");
const {
	signUp,
	signIn,
	signOut,
	verifyUserAccount,
	requestVerificationEmail,
} = require("../controllers/authController");
const authIsUserSignedIn = require("../middlewares/authIsUserSignedIn");
const protectRoute = require("../middlewares/protectRoute");
authRouter
	.route("/signUp")
	.post(
		authIsUserSignedIn,
		createUserId,
		uploadUserAvatarImage.single("avatarImage"),
		signUp
	);
authRouter
	.route("/signIn")
	.post(authIsUserSignedIn, uploadUserAvatarImage.none(), signIn);
authRouter.route("/signOut").get(protectRoute, signOut);
authRouter
	.route("/verifyUserAccount/:verificationToken")
	.get(verifyUserAccount);
authRouter.route("/sendVerificationEmail/:id").get(requestVerificationEmail);

module.exports = authRouter;
