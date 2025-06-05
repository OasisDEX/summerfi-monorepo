import { type NextRequest, NextResponse } from 'next/server'

import { getDeviceType } from '@/helpers/get-device-type'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')
  const response = NextResponse.next()

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
