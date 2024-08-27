import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category"
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
