const express = require("express");
const blogImagesUpload = require("../middlewares/blogImagesUpload");
const blogsRouter = express.Router();
const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogsController");
const protectRoute = require("../middlewares/protectRoute");
const createBlogId = require("../middlewares/createBlogId");
blogsRouter
  .route("/")
  .get(protectRoute, getBlogs)
  .post(
    protectRoute,
    createBlogId,
    blogImagesUpload.array("blogImages", 10),
    createBlog
  );
blogsRouter
  .route("/:id")
  .get(protectRoute, getBlog)
  .patch(protectRoute, blogImagesUpload.array("blogImages", 10), updateBlog)
  .delete(protectRoute, deleteBlog);

module.exports = blogsRouter;
