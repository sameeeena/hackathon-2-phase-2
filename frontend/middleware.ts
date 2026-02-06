import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/landing", "/auth/login", "/auth/register", "/login", "/register"];

// Define protected routes that require authentication (including nested routes)
const protectedRoutes = ["/dashboard/**"]; // Using /** to match all nested routes

// Helper function to check if a path matches a route pattern
function matchesRoute(path: string, route: string): boolean {
  if (route.endsWith("/**")) {
    // Handle wildcard routes like /dashboard/**
    const basePath = route.slice(0, -3); // Remove /**
    return path.startsWith(basePath);
  }
  return path === route;
}

// Helper function to check if a path matches any public routes
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => matchesRoute(path, route));
}

// Helper function to check if a path matches any protected routes
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => matchesRoute(path, route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is public
  const isPublic = isPublicRoute(pathname);

  // Try to get session from cookies by checking for the auth token
  // Better Auth typically sets a session cookie with a specific name
  const cookies = request.headers.get('cookie') || '';
  // Better Auth session token cookie name
  const hasSession = cookies.includes('better-auth.session_token') ||
                    cookies.includes('authjs.session-token') ||
                    cookies.includes('session');

  // If user is authenticated and trying to access a public auth route (like /auth/login), redirect to dashboard
  if (hasSession && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!hasSession && !isPublic && isProtectedRoute(pathname)) {
    // Store the attempted URL in search params so we can redirect back after login
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Also include protected routes explicitly
    "/dashboard/:path*",
  ],
};