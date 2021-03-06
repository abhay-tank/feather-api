const express = require("express");
const authRouter = express.Router();
const createUserId = require("../middlewares/createUserId");
const userAvatarUpload = require("../middlewares/uploadUserAvatarImage");
const {
	signUp,
	signIn,
	signOut,
	verifyUserAccount,
	requestVerificationEmail,
	verifyJWT,
} = require("../controllers/authController");
const authIsUserSignedIn = require("../middlewares/authIsUserSignedIn");
const protectRoute = require("../middlewares/protectRoute");
const cloudinaryConfig = require("../middlewares/cloudinary.Config");
const cloudinaryAvatarImageUpload = require("../middlewares/cloudinary.AvatarImage.Upload");
authRouter
	.route("/signUp")
	.post(
		authIsUserSignedIn,
		createUserId,
		cloudinaryConfig,
		userAvatarUpload.single("avatarImage"),
		cloudinaryAvatarImageUpload,
		signUp
	);
authRouter
	.route("/signIn")
	.post(authIsUserSignedIn, userAvatarUpload.none(), signIn);
authRouter.route("/signOut").get(protectRoute, signOut);
authRouter
	.route("/verifyUserAccount/:verificationToken")
	.get(verifyUserAccount);
authRouter.route("/sendVerificationEmail/:id").get(requestVerificationEmail);
authRouter.route("/verifyJWT").get(verifyJWT);

module.exports = authRouter;
