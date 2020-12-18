const mongoose = require("mongoose");
const {
	validateEmailFormat,
	validatePasswordFormat,
} = require("../validations/userSchemaValidations");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			unique: true,
		},
		firstName: {
			type: String,
			required: [true, "First name is mandatory."],
			trim: true,
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
			required: [true, "Email is Mandatory"],
			validate: {
				validator: validateEmailFormat,
				message: "Email format incorrect",
			},
		},
		avatarImage: {
			type: {
				avatarURL: {
					type: String,
					required: [true, "Avatar image URL not present"],
				},
				avatarAlt: {
					type: String,
					required: [true, "Avatar image alternate description not present"],
				},
			},
		},
		password: {
			type: String,
			required: [true, "Password is Mandatory"],
			minlength: [8, "Password must be atleast of 8 characters or more"],
			maxlength: [512, "Password must not exceed more than 512 characters"],
			validate: {
				validator: validatePasswordFormat,
				message:
					"Password must be combination of lowercase alphabets, uppercase alphabets, numbers and symbols out of  ",
			},
		},
		accountVerified: {
			type: Boolean,
			default: false,
		},
		accountVerificationToken: {
			type: String,
			default: () => {
				let token = "";
				for (let i; i < 7; i++) {
					token += uniqid();
				}
				return Date.now() + token;
			},
			unique: true,
		},
	},
	{ timestamps: true }
);

// Hash User password before saving
userSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
