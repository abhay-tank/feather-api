const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");

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
    useFindAndModify: true,
  },
  (err) => {
    if (err) {
      throw new Error(err);
    }
    const app = express();
    app.use(compression());
    app.use(helmet());
    app.use(express.json());
    app.use(express.static(config.RESOURCES));
    app.use("/auth", authRouter);
    app.use("/blogs", blogsRouter);
    app.listen(config.PORT, () => {
      console.log(`Server running on PORT:${config.PORT}`);
    });
  }
);
