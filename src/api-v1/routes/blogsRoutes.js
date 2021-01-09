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
const cloudinaryConfig = require("../middlewares/cloudinary.Config");
blogsRouter
	.route("/")
	.get(protectRoute, getBlogs)
	.post(
		protectRoute,
		createBlogId,
		cloudinaryConfig,
		uploadBlogImages.array("blogImages", 10),
		createBlog
	);
blogsRouter
	.route("/:id")
	.get(protectRoute, getBlog)
	.patch(protectRoute, uploadBlogImages.array("blogImages", 10), updateBlog)
	.delete(protectRoute, deleteBlog);

module.exports = blogsRouter;
