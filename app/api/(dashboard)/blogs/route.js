import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { getToken } from "@/helpers/token";
import { ImageUpload } from "@/helpers/imageUpload";

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");


    await connect();

    let filter = {};

    if (categoryId) {
      filter = {
        categoryId: new Types.ObjectId(categoryId),
      };
    }

    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" },
        },
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

    return new NextResponse(JSON.stringify({ blogs }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  try {
    const { searchParams } = new URL(request.url);

    const decoded = getToken(request);
    const userId = decoded.userId;

    const categoryId = searchParams.get("categoryId");

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const image = formData.get("image");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user ID" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category ID" }),
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
    const categoryExist = await Category.findById(categoryId);
    if (!categoryExist) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    // Convert the title to a slug for a case-insensitive, unique check
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Check if the slug already exists for the user
    const existingBlog = await Blog.findOne({ slug, user: userId });
    if (existingBlog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog title already exists" }),
        { status: 409 } // Conflict status code
      );
    }

    const thumbPath = await ImageUpload(image, "uploads");


    const newBlog = new Blog({
      title,
      description,
      slug,
      image: thumbPath,
      categoryId: new Types.ObjectId(categoryId),
      user: new Types.ObjectId(userId),
    });

    await newBlog.save();
    return new NextResponse(
      JSON.stringify({ success: true, message: "Blog is created ", blog: newBlog }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in fetching blogs " + error.message, {
      status: 500,
    });
  }
};
