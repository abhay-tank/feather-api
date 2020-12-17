const Blog = require("../models/Blog");

async function validateRelatedBlogId() {
  console.log("Inside validateRelatedBlogID", this);
  return false;
}

module.exports = {
  validateRelatedBlogId,
};
