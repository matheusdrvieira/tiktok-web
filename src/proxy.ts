import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";

const SESSION_COOKIE_NAME = "x-quizzio-token";

const hasSessionCookie = (request: NextRequest): boolean =>
  request.cookies.has(SESSION_COOKIE_NAME);

const isAuthenticated = async (request: NextRequest): Promise<boolean> => {
  if (!hasSessionCookie(request)) {
    return false;
  }

  try {
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      },
    });

    if (error) {
      return false;
    }

    return Boolean(data?.session && data?.user);
  } catch {
    return false;
  }
};

const isProtectedRoute = (pathname: string): boolean =>
  pathname === "/" ||
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/integrations");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isAuthenticated(request);

  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute(pathname) && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/integrations/:path*"],
};
