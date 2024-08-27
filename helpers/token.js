
import jwt from "jsonwebtoken";

export const getToken = (request)=> {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return new NextResponse(
            JSON.stringify({ message: "Token not provided" }),
            { status: 401 }
        );
    } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
};
