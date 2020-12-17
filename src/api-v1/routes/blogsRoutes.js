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

blogsRouter
  .route("/")
  .get(getBlogs)
  .post(upload.array("blogImages", 10), createBlog);
blogsRouter.route("/:id").get(getBlog).patch(updateBlog).delete(deleteBlog);

module.exports = blogsRouter;
