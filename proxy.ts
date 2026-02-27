import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const PUBLIC_ROUTES = new Set(["/terms", "/privacy"]);
const APP_ROUTES = [
  "/studio",
  "/videos",
  "/integrations",
  "/publish",
  "/rendered-videos",
];
const LOGIN_ROUTE = "/login";
const ONBOARDING_ROUTE = "/onboarding";

type SessionResponse = {
  user?: {
    id?: string;
  };
} | null;

type IntegrationResponse = Array<{
  isActive?: boolean;
}>;

const isAppRoute = (pathname: string): boolean => {
  return APP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
};

const redirectTo = (request: NextRequest, pathname: string): NextResponse => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
};

const getCookieHeader = (request: NextRequest): string => {
  return request.headers.get("cookie") ?? "";
};

const getSession = async (request: NextRequest): Promise<SessionResponse> => {
  if (!BACKEND_URL) {
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      method: "GET",
      headers: {
        cookie: getCookieHeader(request),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (!data || typeof data !== "object") {
      return null;
    }

    return data as SessionResponse;
  } catch {
    return null;
  }
};

const getHasActiveIntegration = async (
  request: NextRequest,
): Promise<boolean> => {
  if (!BACKEND_URL) {
    return false;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/integrations`, {
      method: "GET",
      headers: {
        cookie: getCookieHeader(request),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      return false;
    }

    const integrations = data as IntegrationResponse;
    return integrations.some((integration) => integration.isActive === true);
  } catch {
    return false;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const requiresAuthCheck =
    pathname === LOGIN_ROUTE ||
    pathname === ONBOARDING_ROUTE ||
    pathname === "/" ||
    isAppRoute(pathname);

  if (!requiresAuthCheck) {
    return NextResponse.next();
  }

  const session = await getSession(request);
  const isAuthenticated = Boolean(session?.user?.id);

  if (!isAuthenticated) {
    if (pathname === LOGIN_ROUTE) {
      return NextResponse.next();
    }

    return redirectTo(request, LOGIN_ROUTE);
  }

  const hasActiveIntegration = await getHasActiveIntegration(request);

  if (pathname === LOGIN_ROUTE || pathname === "/") {
    return redirectTo(
      request,
      hasActiveIntegration ? "/studio" : ONBOARDING_ROUTE,
    );
  }

  if (!hasActiveIntegration && pathname !== ONBOARDING_ROUTE) {
    return redirectTo(request, ONBOARDING_ROUTE);
  }

  if (hasActiveIntegration && pathname === ONBOARDING_ROUTE) {
    return redirectTo(request, "/studio");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
