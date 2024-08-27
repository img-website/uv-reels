import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { getToken } from "@/helpers/token";
import { ImageUpload } from "@/helpers/imageUpload";

export const GET = async (request, context) => {
  const categoryId = context.params.category;
  try {
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category ID" }),
        { status: 400 }
      );
    }

    await connect();

    // Aggregation pipeline
    let aggregationPipline = [
      {
        $match: {
          _id: new Types.ObjectId(categoryId) // Match the specific category ID
        }
      },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "category",
          as: "relatedBlogs"
        }
      },
      {
        $addFields: {
          blogCount: { $size: "$relatedBlogs" }
        }
      }
    ];

    const category = await Category.aggregate(aggregationPipline);

    if (!category) {
      return new NextResponse(JSON.stringify({ message: "Category not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ category }), {
      status: 200,
    });

  } catch (error) {
    return new NextResponse("Error in fetching a category" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request, context) => {
  const categoryId = context.params.category;
  try {
    const decoded = getToken(request);

    const userId = decoded.userId;

    const formData = await request.formData();
    const title = formData.get("title");
    const thumb = formData.get("thumb");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
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

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 404,
        }
      );
    }

    // Convert the title to a slug for a case-insensitive, unique check
    const slug = title
      ?.toLowerCase()
      ?.replace(/[^a-z0-9\s-]/g, "")
      ?.trim()
      ?.replace(/\s+/g, "-");


    // Check if the title already exists for another category
    const existingCategoryWithTitle = await Category.findOne({ title, _id: { $ne: categoryId } });
    if (existingCategoryWithTitle) {
      return new NextResponse(
        JSON.stringify({ message: "Title already exists in another category" }),
        { status: 409 } // Conflict status code
      );
    }

    // Prepare the update data
    const updateData = {
      title,
      slug,
    };

    // If thumb is provided, handle image upload
    let thumbPath = category.thumb; // keep the existing thumb path
    if (thumb && thumb.size > 0) {
      thumbPath = await ImageUpload(thumb, "uploads");
      updateData.thumb = thumbPath;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category is updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in updating category " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request, context) => {
  const categoryId = context.params.category;
  try {
    const decoded = getToken(request);
    const userId = decoded.userId;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId " }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId " }),
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

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found or does not belong to the user",
        }),
        {
          status: 404,
        }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({ message: "Category deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in deleting category " + error.message, {
      status: 500,
    });
  }
};
