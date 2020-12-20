const Blog = require("../models/Blog");
const ErrorResponse = require("../models/ErrorResponse");
const sendErrorResponse = require("../middlewares/responses/sendErrorResponse");
const sendSuccessResponse = require("../middlewares/responses/sendSuccessResponse");
const { config } = require("../configuration/config");
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
// GET
const getBlogs = async (req, res) => {
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
				throw new ErrorResponse(404, "unsuccessful", "Blogs not present");
			} else {
				sendSuccessResponse(200, "successful", result, res);
			}
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof ErrorResponse) {
				sendErrorResponse(err, res);
			} else {
				sendErrorResponse(
					new ErrorResponse(
						500,
						"unsuccessful",
						`Error fetching blogs: ${err.toString}`
					),
					res
				);
			}
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
					"/" +
					config.BLOG_IMAGES +
					"/" +
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
				throw new ErrorResponse(500, "unsuccessful", "Error saving blog");
			} else {
				const showKeys = [
					"blogId",
					"blogAuthor",
					"blogTitle",
					"blogContent",
					"blogImages",
					"blogRelatedLinks",
					"createdAt",
				];
				let blog = {};
				showKeys.forEach((key) => {
					if (result[key]) {
						blog[key] = result[key];
					}
				});
				sendSuccessResponse(201, "successful", blog, res);
			}
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof ErrorResponse) {
				return sendErrorResponse(err, res);
			} else {
				return sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

// GET:id
const getBlog = (req, res) => {
	let selectQuery = "-_id";
	if (req.query.select) {
		req.query.select.split(" ").forEach((property) => {
			if (validBlogKeys.includes(property) && property != "_id") {
				selectQuery += " " + property;
			}
		});
	}
	Blog.findOne({ blogId: req.params.id })
		.select(selectQuery)
		.then((result) => {
			if (!result) {
				throw new ErrorResponse(404, "unsuccessful", "Blog not found");
			}
			return sendSuccessResponse(200, "successful", result, res);
		})
		.catch((err) => {
			if (err instanceof ErrorResponse) {
				return sendErrorResponse(err, res);
			} else {
				return sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

// PATCH:id
const updateBlog = (req, res) => {
	const updateValidKeys = ["blogAuthor", "blogTitle", "blogContent"];
	let blogImages = [];
	let relatedLinks = [];
	if (req.files) {
		req.files.forEach((pic) => {
			blogImages.push({
				blogImageAlt: pic.originalname.split(".")[0],
				blogImageURL:
					req.protocol +
					"://" +
					req.get("host") +
					req.originalUrl +
					req.params.id +
					"/" +
					pic.filename,
			});
		});
	}
	let selectQuery = "-_id";
	if (req.query.select) {
		req.query.select.split(" ").forEach((property) => {
			if (validBlogKeys.includes(property) && property != "_id") {
				selectQuery += " " + property;
			}
		});
	}
	const updates = {};
	Object.keys(req.body).forEach((key) => {
		if (updateValidKeys.includes(key)) {
			updates[key] = req.body[key];
		}
	});
	if (blogImages.length) {
		updates.blogImages = blogImages;
	}
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
	}
	if (relatedLinks) {
		updates.blogRelatedLinks = relatedLinks;
	}
	if (!updates) {
		return sendErrorResponse(
			new ErrorResponse(400, "unsuccessful", "No updates found"),
			res
		);
	}
	Blog.findOneAndUpdate({ blogId: req.params.id }, updates, {
		new: true,
		runValidators: true,
	})
		.select(selectQuery)
		.then((result) => {
			if (!result) {
				throw new ErrorResponse(404, "unsuccessful", "Blog not found");
			}
			return sendSuccessResponse(200, "successful", result, res);
		})
		.catch((err) => {
			if (err instanceof ErrorResponse) {
				return sendErrorResponse(err, res);
			} else {
				return sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

// DELETE:id
const deleteBlog = (req, res) => {
	let selectQuery = "-_id";
	if (req.query.select) {
		req.query.select.split(" ").forEach((property) => {
			if (validBlogKeys.includes(property) && property != "_id") {
				selectQuery += " " + property;
			}
		});
	}
	Blog.findOneAndDelete({ blogId: req.params.id })
		.select(selectQuery)
		.then((result) => {
			if (!result) {
				return sendErrorResponse(
					new ErrorResponse(404, "unsuccessful", "Blog not found"),
					res
				);
			}
			return sendSuccessResponse(200, "successful", result, res);
		})
		.catch((err) => {
			console.error(err);
			if (err instanceof ErrorResponse) {
				return sendErrorResponse(err, res);
			} else {
				return sendErrorResponse(
					new ErrorResponse(500, "unsuccessful", err.toString()),
					res
				);
			}
		});
};

module.exports = { getBlogs, createBlog, getBlog, updateBlog, deleteBlog };
