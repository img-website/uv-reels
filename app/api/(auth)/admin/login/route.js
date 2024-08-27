// api/(auth)/admin/login/route.js
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
    try {
        const { email, password } = await request.json();
        await connect();

        // Email se user find karo
        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return new NextResponse(JSON.stringify({ message: "Unauthorized access" }), {
                status: 401,
            });
        }

        // Password verify karo
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), {
                status: 401,
            });
        }

        // JWT token generate karo
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return new NextResponse(
            JSON.stringify({
                message: "Admin logged Successfully",
                success: true,
                user: {
                    email: user.email,
                    role: user.role
                },
                token
            }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse("Error in admin login " + error.message, {
            status: 500,
        });
    }
};
