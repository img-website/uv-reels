// middleware.js
import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

export const config = {
    matcher: [
        "/admin/:path*",
        // "/api/:path*",
    ],
};

export const middleware = (request) => {
    const { pathname } = request.nextUrl;
    const accessTokenCookie = request.cookies.get('token');
    const isLoggedIn = !!accessTokenCookie;

    // Bypass middleware for login API route to avoid redirect loop
    if (pathname.startsWith("/api/admin/login")) {
        return NextResponse.next();
    }

    // Log API requests for blogs
    if (pathname.startsWith("/api/blogs")) {
        const logResult = logMiddleware(request);
        console.log(logResult.response);
    }

    // Validate Token
    const authResult = authMiddleware(request);
    if (!authResult?.isValid) {
        // If token is invalid and accessing admin page, redirect to login
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }

    // Redirect logic
    if (!isLoggedIn) {
        if (!pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/register")) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    } else {
        if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/register")) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return NextResponse.next();
};




// import { NextResponse } from "next/server";
// import { authMiddleware } from "./middlewares/api/authMiddleware";
// import { logMiddleware } from "./middlewares/api/logMiddleware";



// export const config = {
//     matcher: [
//         "/admin/:path*",
//         "/api/:path*",
//     ],
// };

// export const middleware = (request) => {
//     const accessTokenCookie = request.cookies.get('token');
//     const isLoggedIn = !!accessTokenCookie;


//     if (request.url.includes("/api/blogs")) {
//         const logResult = logMiddleware(request);
//         console.log(logResult.response);
//     }

//     const authResult = authMiddleware(request);
//     if (!authResult?.isValid) {
//         return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
//             status: 401,
//         });
//     }

//     // if (!isLoggedIn) {
//     //     if (!request.nextUrl.pathname.startsWith("/admin/login") &&
//     //         !request.nextUrl.pathname.startsWith("/admin/register")) {
//     //         return NextResponse.redirect(new URL("/admin/login", request.url));
//     //     }
//     // } else {
//     //     if (request.nextUrl.pathname.startsWith("/admin/login") ||
//     //         request.nextUrl.pathname.startsWith("/admin/register")) {
//     //         return NextResponse.redirect(new URL("/admin", request.url));
//     //     }
//     // }

//     return NextResponse.next();
// };
