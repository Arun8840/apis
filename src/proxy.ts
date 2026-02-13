// proxy.ts (Next.js 16+) or middleware.ts (older versions)
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  // This check is only for optimistic redirection and is not fully secure on its own.
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/"], // Specify the routes you want to protect.
}
