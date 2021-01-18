const User = require("../models/User");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("../middlewares/responses/sendErrorResponse");
const sendSuccessResponse = require("../middlewares/responses/sendSuccessResponse");
const { config } = require("../configuration/config");
const { generateToken, verifyToken } = require("../helpers/jwtFunctions");
const sendVerificationEmail = require("../helpers/sendVerificationEmail");
const mongoose = require("mongoose");

// POST "/signUp"
const signUp = (req, res) => {
	let newUserObject = {
		userId: req.headers.userId,
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName || null,
		password: req.body.password,
	};
	if (req.body.image) {
		newUserObject.avatarImage = {
			avatarAlt: "avatarImage",
			avatarSignature: req.body.image.signature,
			avatarPublicId: req.body.image.public_id,
			avatarURL: req.body.image.secure_url,
		};
	}
	const newUser = new User(newUserObject);
	newUser
		.save()
		.then((result) => {
			if (!result) {
				throw new ErrorResponse(500, "unsuccessful", "User not generated");
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
					config.FRONTEND_URL +
					"/auth/verifyUserAccount/" +
					result.accountVerificationToken;
				let verificationStatus = sendVerificationEmail(
					result.firstName,
					result.email,
					verificationURL
				);
				if (verificationStatus instanceof Error) {
					throw new ErrorResponse(
						500,
						"unsuccessful",
						"Error sending verification email"
					);
				}
				sendSuccessResponse(200, "successful", user, res);
			}
		})
		.catch(async (err) => {
			if (err instanceof ErrorResponse) {
				return sendErrorResponse(err, res);
			} else if (err instanceof mongoose.Error.ValidationError) {
				console.error(err);
				return sendErrorResponse(
					new ErrorResponse(400, "unsuccessful", err.errors.toString()),
					res
				);
			} else if (err && err.code === 11000) {
				return sendErrorResponse(
					new ErrorResponse(406, "unsuccessful", "User already exists."),
					res
				);
			} else {
				return sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

// POST "/signIn"
const signIn = (req, res) => {
	// Check if request contains email and password.
	let email;
	let password;
	try {
		email = req.body.email;
		password = req.body.password;
		if (!email || !password) {
			throw new ErrorResponse(
				400,
				"unsuccessful",
				"Email and password needed for sign in."
			);
		}
	} catch (error) {
		return sendErrorResponse(error, res);
	}
	try {
		let emailValidResult = User.isEmailValid(email);
		let passwordValidResult = User.isPasswordValid(password);
		// Check if email and password are valid in valid format
		if (!emailValidResult || !passwordValidResult) {
			throw new ErrorResponse(
				400,
				"unsuccessful",
				"Email or password in incorrect format "
			);
		}
	} catch (error) {
		console.error(error);
		if (error instanceof ErrorResponse) {
			return sendErrorResponse(error, res);
		} else {
			return sendErrorResponse(
				new ErrorResponse(500, "unsuccessful", error.toString),
				res
			);
		}
	}
	User.findOne({ email: email })
		.then(async (userDoc) => {
			if (!userDoc) {
				throw new ErrorResponse(404, "unsuccessful", "User not found");
			}
			const compareResult = await User.comparePasswords(
				userDoc.password,
				password
			);
			if (!compareResult) {
				throw new ErrorResponse(
					400,
					"unsuccessful",
					"Password does not match."
				);
			}
			if (!userDoc.accountVerified) {
				throw new ErrorResponse(
					400,
					"unsuccessful",
					"Please verify your account first by visiting verification link sent to you by Verification Email."
				);
			}
			const jwtToken = await generateToken(
				{
					email: userDoc.email,
					userId: userDoc.userId,
				},
				config.JWT_SECRET
			);
			let showKeys = [
				"userId",
				"email",
				"firstName",
				"lastName",
				"avatarImage",
				"accountVerified",
				"createdAt",
				"updatedAt",
			];
			let signedInUser = {};
			showKeys.forEach((key) => {
				if (userDoc[key]) {
					signedInUser[key] = userDoc[key];
				}
			});
			res.cookie("jwt", jwtToken);
			sendSuccessResponse(
				202,
				"successful",
				{
					jwt: jwtToken,
					user: signedInUser,
				},
				res
			);
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof ErrorResponse) {
				return sendErrorResponse(err, res);
			} else if (err instanceof mongoose.Error.ValidationError) {
				return sendErrorResponse(
					new ErrorResponse(400, "unsuccessful", err.errors.toString()),
					res
				);
			} else {
				return sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

// GET "/signOut"
const signOut = (req, res) => {
	if (!req.currentUser) {
		return sendErrorResponse(
			new ErrorResponse(400, "Unsuccessful", "Please Signin first"),
			res
		);
	}
	res.clearCookie("jwt");
	sendSuccessResponse(202, "Successful", "Signed out successfully", res);
};

// GET "/verifyUserAccount/:verificationToken"
const verifyUserAccount = (req, res) => {
	User.findOne({ accountVerificationToken: req.params.verificationToken })
		.then((result) => {
			if (!result) {
				throw new ErrorResponse(404, "unsuccessful", "User does not exists.");
			} else {
				if (result.accountVerified) {
					throw new ErrorResponse(
						400,
						"unsuccessful",
						"User already verified."
					);
				}
				return User.findOneAndUpdate(
					{ userId: result.userId },
					{ accountVerified: true },
					{ new: true }
				);
			}
		})
		.then((userDoc) => {
			if (!userDoc) {
				throw new ErrorResponse(500, "unsuccessful", "Error verifying user.");
			}
			let showKeys = [
				"userId",
				"email",
				"firstName",
				"lastName",
				"avatarImage",
				"accountVerified",
				"createdAt",
				"updatedAt",
			];
			let verifiedUser = {};
			showKeys.forEach((key) => {
				if (userDoc[key]) {
					verifiedUser[key] = userDoc[key];
				}
			});
			sendSuccessResponse(200, "successful", verifiedUser, res);
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof ErrorResponse) {
				sendErrorResponse(err, res);
			} else if (err instanceof mongoose.Error.ValidationError) {
				return sendErrorResponse(
					new ErrorResponse(400, "unsuccessful", err.errors.toString()),
					res
				);
			} else {
				sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

// GET
const requestVerificationEmail = (req, res) => {
	User.findOne({ userId: req.params.id })
		.then((result) => {
			if (!result) {
				throw new ErrorResponse(400, "unsuccessful", "User not found");
			} else {
				const verificationURL =
					config.FRONTEND_URL +
					"/auth/verifyUserAccount/" +
					result.accountVerificationToken;
				let verificationStatus = sendVerificationEmail(
					result.firstName,
					result.email,
					verificationURL
				);
				if (verificationStatus instanceof Error) {
					throw new ErrorResponse(
						500,
						"unsuccessful",
						"Error sending verification email"
					);
				}
				sendSuccessResponse(
					200,
					"successful",
					"New verification email sent successfully.",
					res
				);
			}
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof ErrorResponse) {
				sendErrorResponse(err, res);
			} else {
				sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

const verifyJWT = async (req, res) => {
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
		console.log("decoded token", decoded);
	} catch (err) {
		console.error("Decoding Error", err);
		return sendErrorResponse(
			new ErrorResponse(401, "unsuccessful", "Invalid Token"),
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
				let showKeys = [
					"userId",
					"email",
					"firstName",
					"lastName",
					"avatarImage",
					"accountVerified",
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
						user: signedInUser,
					},
					res
				);
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
module.exports = {
	signUp,
	signIn,
	signOut,
	verifyUserAccount,
	requestVerificationEmail,
	verifyJWT,
};
