const uniqid = require("uniqid");
const createBlogId = (req, res, next) => {
	req.headers.blogId = "blog" + "-" + uniqid();
	next();
};

module.exports = createBlogId;
