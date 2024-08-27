import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import User from "@/lib/modals/user";
import { getToken } from "@/helpers/token";
import { ImageUpload } from "@/helpers/imageUpload";
import { CheckTokenExpiration } from "@/helpers/checkTokenExpiration";

export const GET = async (request, context) => {
  const blogId = context.params.blog;
  try {
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blog ID" }),
        { status: 400 }
      );
    }

    await connect();

    const blog = await Blog.findOne({
      _id: blogId
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), {
      status: 200,
    });

  } catch (error) {
    return new NextResponse("Error in fetching a blog" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request, context) => {
  const blogId = context.params.blog;
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const image = formData.get("image");
    const categoryId = formData.get("categoryId");

    const decoded = getToken(request);
    const userId = decoded.userId;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user ID" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blog ID" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    // Convert the title to a slug for a case-insensitive, unique check
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Check if the title already exists for another blog
    const existingBlogWithTitle = await Blog.findOne({ title, _id: { $ne: blogId } });
    if (existingBlogWithTitle) {
      return new NextResponse(
        JSON.stringify({ message: "Title already exists in another blog" }),
        { status: 409 } // Conflict status code
      );
    }

    // Prepare the update data
    const updateData = {
      title,
      description,
      slug,
      categoryId,
    };

    // If image is provided, handle image upload
    let imagePath = blog.image; // keep the existing image path
    if (image && image.size > 0) {
      imagePath = await ImageUpload(image, "uploads");
      updateData.image = imagePath;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateData,
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "Blog updated successfully", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error) {
    CheckTokenExpiration(error);
    return new NextResponse("Error updating blog " + error?.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request, context) => {
  const blogId = context.params.blog;
  try {
    const decoded = getToken(request);
    const userId = decoded.userId;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user ID" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blog ID" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(JSON.stringify({ message: "Blog deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in deleting blog" + error.message, {
      status: 500,
    });
  }
};
