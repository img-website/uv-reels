import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { getToken } from "@/helpers/token";
import { ImageUpload } from "@/helpers/imageUpload";

export const GET = async (request) => {
  try {

    await connect();
    
    let agePipe =[];
    agePipe.push({
      $lookup: {
        from: "blogs",
        localField: "_id",
        foreignField: "categoryId",
        as: "relatedBlogs"
      }
    });
    agePipe.push({
      $addFields: {
        blogCount: { $size: "$relatedBlogs" }
      }
    });
    const categories = await Category.aggregate(agePipe);

    const data = categories?.length && categories?.map(item => {
      return {
        ...item,
        // thumb : `${process.env.NEXT_PUBLIC_BASE_URL}${item.thumb}`
        thumb : item.thumb
      }
    })

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in fetching categories" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  try {
    const decoded = getToken(request);
    
    const userId = decoded.userId;

    const formData = await request.formData();
    const title = formData.get("title");
    const thumb = formData.get("thumb");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found in the database" }), {
        status: 404,
      });
    }

    // Convert the title to a slug for a case-insensitive, unique check
    const slug = title
      ?.toLowerCase()
      ?.replace(/[^a-z0-9\s-]/g, "")
      ?.trim()
      ?.replace(/\s+/g, "-");

    // Check if the slug already exists for the user
    const existingCategory = await Category.findOne({ slug, user: userId });
    if (existingCategory) {
      return new NextResponse(
        JSON.stringify({ message: "Category title already exists" }),
        { status: 409 } // Conflict status code
      );
    }

    const thumbPath = await ImageUpload(thumb, "uploads");


    const newCategory = new Category({
      title,
      slug,
      thumb: thumbPath,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in creating category - " + error.message, {
      status: 500,
    });
  }
};
