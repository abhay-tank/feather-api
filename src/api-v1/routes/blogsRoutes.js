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
const createBlogId = require("../middlewares/createBlogId");
blogsRouter
	.route("/")
	.get(getBlogs)
	.post(createBlogId, blogImagesUpload.array("blogImages", 10), createBlog);
blogsRouter
	.route("/:id")
	.get(getBlog)
	.patch(blogImagesUpload.array("blogImages", 10), updateBlog)
	.delete(deleteBlog);

module.exports = blogsRouter;
