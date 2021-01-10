const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
if (!process.env.NODE_ENV && process.env.NODE_ENV != "production") {
	dotenv.config({ path: path.join(__dirname, "config.env") });
}
const { config } = require("./src/api-v1/configuration/config");
const authRouter = require("./src/api-v1/routes/authRoutes");
const blogsRouter = require("./src/api-v1/routes/blogsRoutes");
mongoose.connect(
	config.DATABASE_URL,
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	(err) => {
		if (err) {
			throw new Error(err);
		}
		const app = express();
		app.use(cors());
		app.use(compression());
		app.use(helmet());
		app.use(express.json());
		app.use("/auth", authRouter);
		app.use("/blogs", blogsRouter);
		app.use((req, res, next) => {
			res
				.status(200)
				.send(
					"Visit Feather API documentation at https://github.com/abhay-tank/feather-api#feather-api"
				);
		});
		app.listen(config.PORT, () => {
			console.log(`Server running on PORT:${config.PORT}`);
		});
	}
);
