const express = require("express");
const blogsRouter = express.Router();
const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogsController");

blogsRouter.route("/").get(getBlogs).post(createBlog);
blogsRouter.route("/:id").get(getBlog).patch(updateBlog).delete(deleteBlog);

module.exports = blogsRouter;
