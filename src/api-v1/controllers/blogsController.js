const { config } = require("../configuration/config");
const Blog = require("../models/Blog");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("../middlewares/responses/sendErrorResponse");
const sendSuccessResponse = require("../middlewares/responses/sendSuccessResponse");
// GET
const getBlogs = async (req, res) => {
  const validBlogKeys = [
    "blogId",
    "blogAuthor",
    "blogTitle",
    "blogContent",
    "blogImages",
    "blogRelatedLinks",
    "createdAt",
    "updatedAt",
  ];
  let selectQuery = "-_id";
  let limit = 10;
  if (
    req.query.limit &&
    !isNaN(parseInt(req.query.limit)) &&
    parseInt(req.query.limit) > 0
  ) {
    limit = parseInt(req.query.limit);
  }
  if (req.query.select) {
    req.query.select.split(" ").forEach((property) => {
      if (validBlogKeys.includes(property) && property != "_id") {
        selectQuery += " " + property;
      }
    });
  }
  Blog.find()
    .limit(limit)
    .select(selectQuery)
    .then((result) => {
      if (!result) {
        sendErrorResponse(
          new ErrorResponse(404, "unsuccessful", "Blogs not present"),
          res
        );
      } else {
        sendSuccessResponse(200, "successful", result, res);
      }
    })
    .catch((err) => {
      sendErrorResponse(
        new ErrorResponse(500, "unsuccessful", "Error fetching blogs"),
        res
      );
    });
};

// POST
const createBlog = (req, res) => {
  let blogImages = [];
  const requiredKeys = ["blogAuthor", "blogTitle", "blogContent"];
  if (req.files) {
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
  }
  let result = requiredKeys.every((key) => {
    return req.body[key];
  });
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
  let relatedLinks;
  if (req.body.blogRelatedLinks) {
    try {
      relatedLinks = JSON.parse(req.body.blogRelatedLinks);
    } catch (error) {
      return sendErrorResponse(
        new ErrorResponse(
          400,
          "unsuccessful",
          "Related links not in JSON format."
        ),
        res
      );
    }
  } else {
    relatedLinks = [];
  }
  const newBlog = new Blog({
    blogId: req.headers.blogId,
    blogAuthor: req.body.blogAuthor,
    blogTitle: req.body.blogTitle,
    blogContent: req.body.blogContent,
    blogImages: blogImages,
    blogRelatedLinks: relatedLinks,
  });
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
        new ErrorResponse(400, "unsuccessful", err.toString()),
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
