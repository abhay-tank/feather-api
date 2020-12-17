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

    app.listen(config.PORT, () => {
      console.log(`Server running on PORT:${config.PORT}`);
    });
  }
);
