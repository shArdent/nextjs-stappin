import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "./env";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL!,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        },
    );

    let userRole: string;

    const { data } = await supabase.auth.getUser();
    const pathname = req.nextUrl.pathname;

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/catalog", req.url));
    }
    // --- Route login & register: hanya untuk yang belum login ---
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        if (data.user) {
            return NextResponse.redirect(new URL("/catalog", req.url));
        }
        return res;
    }

    // --- Route admin: hanya untuk admin authenticated ---
    if (pathname.startsWith("/admin")) {
        if (!data.user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        userRole = "USER";

        if (data.user) {
            const res = await supabase
                .from("User")
                .select("role")
                .eq("id", data.user.id);

            userRole = res.data![0]?.role;
        }

        // Ambil user role dari metadata

        if (userRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/catalog", req.url));
        }
        return res;
    }

    // --- Route lainnya: untuk authenticated user ---
    if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/cart") ||
        pathname.startsWith("/catalog") ||
        pathname.startsWith("/loan") ||
        pathname.startsWith("/profile")
    ) {
        if (!data.user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return res;
    }

    // --- Default: biarkan lewat ---
    return res;
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/admin/:path*",
        "/dashboard",
        "/cart",
        "/catalog",
        "/loan/:path*",
        "/profile/:path*",
    ],
};
