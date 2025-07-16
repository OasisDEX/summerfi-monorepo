import { type NextRequest, NextResponse } from 'next/server'

import { getDeviceType } from '@/helpers/get-device-type'
import { sanitizeReferralCode } from '@/helpers/sanitize-referral-code'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')
  const response = NextResponse.next()

  const referrer = request.headers.get('referer')

  if (referrer) {
    const url = new URL(referrer)
    const rawReferralCode = url.searchParams.get('referralCode')

    if (rawReferralCode) {
      const sanitizedCode = sanitizeReferralCode(rawReferralCode)

      if (sanitizedCode) {
        response.cookies.set({
          name: 'referralCode',
          value: sanitizedCode,
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 12 * 60 * 60, // 12 hours
          path: '/earn',
        })
      }
    }
  }

  // Only set device type if we have a user agent
  if (userAgent) {
    const deviceInfo = getDeviceType(userAgent)

    response.cookies.set('deviceType', deviceInfo.deviceType)
  }

  // Get `CloudFront-Viewer-Country` header if exists from request and set cookie
  const country = request.headers.get('CloudFront-Viewer-Country')

  if (country) {
    response.cookies.set('country', country)
  }

  if (process.env.NODE_ENV === 'development') {
    const reqOrigin = request.headers.get('origin') ?? ''

    response.headers.set('Access-Control-Allow-Origin', reqOrigin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  return response
}

// Specify the paths to apply the middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
