import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getRateLimitConfig } from "@/lib/config"
import logger from "@/lib/logger"

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export async function middleware(request: NextRequest) {
  const config = getRateLimitConfig()
  const ip = request.ip || "unknown"
  const now = Date.now()

  // Clean up expired rate limit entries
  for (const [key, value] of rateLimit.entries()) {
    if (value.resetTime < now) {
      rateLimit.delete(key)
    }
  }

  // Check rate limit
  const rateLimitInfo = rateLimit.get(ip)
  if (rateLimitInfo) {
    if (rateLimitInfo.count >= config.max) {
      logger.warn("Rate limit exceeded", { ip })
      return new NextResponse(
        JSON.stringify({ error: config.message }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "900", // 15 minutes in seconds
          },
        }
      )
    }
    rateLimitInfo.count++
  } else {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + config.windowMs,
    })
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  // Log request
  logger.debug("Request processed", {
    method: request.method,
    path: request.nextUrl.pathname,
    ip,
  })

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
} 