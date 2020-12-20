const express = require("express");
const blogsRouter = express.Router();
const uploadBlogImages = require("../middlewares/uploadBlogImages");
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
	.post(protectRoute, createBlogId, uploadBlogImages, createBlog);
blogsRouter
	.route("/:id")
	.get(protectRoute, getBlog)
	.patch(protectRoute, uploadBlogImages, updateBlog)
	.delete(protectRoute, deleteBlog);

module.exports = blogsRouter;
