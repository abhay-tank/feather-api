const Blog = require("../models/Blog");
const mongoose = require("mongoose");
async function validateRelatedBlogId() {
  return await mongoose.model("Blog").exists({ blogId: this.relatedBlogId });
}

module.exports = {
  validateRelatedBlogId,
};
