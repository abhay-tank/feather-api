const express = require("express");
const upload = require("../configuration/multerConfig");
const blogsRouter = express.Router();
const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogsController");
const createBlogId = require("../middlewares/createBlogId");
blogsRouter
  .route("/")
  .get(getBlogs)
  .post(createBlogId, upload.array("blogImages", 10), createBlog);
blogsRouter
  .route("/:id")
  .get(getBlog)
  .patch(upload.array("blogImages", 10), updateBlog)
  .delete(deleteBlog);

module.exports = blogsRouter;
