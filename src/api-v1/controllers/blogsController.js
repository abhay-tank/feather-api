const { config } = require("../configuration/config");
const Blog = require("../models/Blog");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("../middlewares/responses/sendErrorResponse");
const sendSuccessResponse = require("../middlewares/responses/sendSuccessResponse");
const blogKeys = ["blogId", "blogAuthor", "blogTitle", "blogContent"];
// GET
const getBlogs = (req, res) => {};

// POST
const createBlog = (req, res) => {
  let blogImages = [];
  req.files.forEach((pic) => {
    blogImages.push({
      blogImageAlt: pic.originalname.split(".")[0],
      blogImageURL:
        req.protocol +
        "://" +
        req.get("host") +
        req.originalUrl +
        req.body.blogId +
        "/" +
        pic.filename,
    });
  });
  let result = blogKeys.every((key) => req.body[key]);
  if (!result) {
    return sendErrorResponse(
      new ErrorResponse(
        400,
        "unsuccessful",
        "Invalid request body, please include all required fields"
      ),
      res
    );
  }
  const newBlogBody = {
    blogId: req.body.blogId,
    blogAuthor: req.body.blogAuthor,
    blogTitle: req.body.blogTitle,
    blogContent: req.body.blogContent,
    blogImages: blogImages,
  };
  const newBlog = new Blog(newBlogBody);
  newBlog
    .save()
    .then((result) => {
      if (!result) {
        sendErrorResponse(
          new ErrorResponse(500, "unsuccessful", "Error saving blog"),
          res
        );
      } else {
        sendSuccessResponse(
          201,
          "successful",
          "Blog created successfully",
          res
        );
      }
    })
    .catch((err) => {
      console.error(err);
      sendErrorResponse(
        new ErrorResponse(500, "unsuccessful", "Error saving blog"),
        res
      );
    });
};

// GET:id
const getBlog = (req, res) => {};

// PATCH:id
const updateBlog = (req, res) => {};

// DELETE:id
const deleteBlog = (req, res) => {};

module.exports = { getBlogs, createBlog, getBlog, updateBlog, deleteBlog };
