import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Note: For demo mode (no Supabase env), we skip auth gating completely.
// To enable auth, set NEXT_PUBLIC_SUPABASE_URL and ANON_KEY, then uncomment below.
export async function middleware(_request: NextRequest) {
  return NextResponse.next();
  // const { updateSession } = await import("@/lib/supabase/middleware");
  // return updateSession(_request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
