import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// NOTE: In Next.js 16, this function must be named 'proxy' instead of 'middleware'
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Define Protected Routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      // 3. Redirect Unauthenticated Users
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Optional: Redirect Logged-in users AWAY from login/register
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && user) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};