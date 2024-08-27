import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getToken } from "@/helpers/token";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching users " + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  try {
    const { email, username, password, role } = await request.json();

    await connect();

    // Password encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role: role || "user", // Default role user set karo
    });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expiry time
    );

    return new NextResponse(
      JSON.stringify({ message: "User is created ", user: newUser, token }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in creating user " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request) => {
  try {
    const decoded = getToken(request);

    const { newUsername, newPassword, newRole } = await request.json();

    await connect();

    const userId = decoded.userId;

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
        status: 400,
      });
    }

    // Update fields
    const updateFields = {};
    if (newUsername) updateFields.username = newUsername;
    if (newPassword) updateFields.password = await bcrypt.hash(newPassword, 10);
    if (newRole) updateFields.role = newRole;

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated ", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in updating user " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User id" }), {
        status: 400,
      });
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is deleted ", user: deletedUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in deleting user " + error.message, {
      status: 500,
    });
  }
};
