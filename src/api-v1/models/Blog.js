const mongoose = require("mongoose");
const uniqid = require("uniqid");
const {
  validateRelatedBlogId,
} = require("../validations/blogSchemaValidations");

const blogSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      required: [true, "Invalid input for blogId"],
      unique: true,
    },
    blogAuthor: {
      type: String,
      required: [true, "Invalid input for blogAuthor"],
    },
    blogTitle: {
      type: String,
      required: [true, "Invalid input for blogTitle"],
    },
    blogContent: {
      type: String,
      required: [true, "Invalid input for blogContent"],
    },
    blogImages: [
      {
        blogImageId: {
          type: String,
          default: "img" + uniqid(),
        },
        blogImageAlt: {
          type: String,
          required: [true, "Invalid input for blogImageAlt"],
        },
        blogImageURL: {
          type: String,
          required: [true, "Invalid input for blogImageURL"],
        },
      },
    ],
    blogRelatedLinks: [
      {
        relatedBlogId: {
          type: String,
          required: true,
          validate: {
            validator: validateRelatedBlogId,
            message: "Invalid input for relatedBlogId or blog not found",
          },
        },
        relatedBlogTitle: {
          type: String,
          required: [true, "Invalid input for relatedBlogTitle"],
        },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
