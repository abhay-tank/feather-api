const uniqid = require("uniqid");
const createBlogId = (req, res, next) => {
  req.headers.blogId = uniqid();
  next();
};

module.exports = createBlogId;
