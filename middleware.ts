import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Demo auth gating: cookie "alesya_auth" di-set oleh /login page.
// Untuk auth real (Supabase), uncomment baris updateSession di bawah & set env-nya.
const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals & static assets (matcher juga sudah filter, ini sebagai jaga-jaga)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const hasAuth = request.cookies.get("alesya_auth")?.value === "1";

  // Belum login + akses halaman protected → ke /login
  if (!hasAuth && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Sudah login + buka /login → langsung ke dashboard
  if (hasAuth && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();

  // Untuk Supabase auth real, gunakan ini:
  // const { updateSession } = await import("@/lib/supabase/middleware");
  // return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
