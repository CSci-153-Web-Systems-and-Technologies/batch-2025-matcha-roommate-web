import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // 1. Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Initialize Supabase Client
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

  // 3. Get the Current User
  // This refreshes the session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- SECURITY RULES ---

  // Rule A: Protect Dashboard Routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    
    // Check 1: Is the user logged in?
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(redirectUrl);
    }

    // Check 2: Is the email verified?
    // If 'email_confirmed_at' is missing, they haven't clicked the link yet.
    if (!user.email_confirmed_at) {
      const verifyUrl = request.nextUrl.clone();
      verifyUrl.pathname = "/login";
      verifyUrl.searchParams.set("error", "email_not_verified");
      return NextResponse.redirect(verifyUrl);
    }
  }

  // Rule B: Redirect Logged-in Users AWAY from Auth Pages
  // (Prevents them from seeing Login/Register if they are already authenticated)
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && user) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// Configuration: Apply this proxy to all routes EXCEPT static files and images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};