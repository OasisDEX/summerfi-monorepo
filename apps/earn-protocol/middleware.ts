import { type DeviceInfo, DeviceType } from '@summerfi/app-types'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Detects the type of device based on the user agent string.
 *
 * @param userAgent - The user agent string, typically from `navigator.userAgent` on the client side or `req.headers['user-agent']` on the server side.
 * @returns An object containing:
 * - `deviceType`: The type of device detected, which can be one of `DeviceType.MOBILE`, `DeviceType.TABLET`, or `DeviceType.DESKTOP`.
 *
 * @example
 * const deviceInfo = getDeviceType(navigator.userAgent);
 * console.log(deviceInfo.deviceType); // "MOBILE", "TABLET", or "DESKTOP"
 *
 * @remarks
 * - The function determines the device type by matching known mobile and tablet keywords in the user agent string.
 * - The user agent is converted to lowercase to ensure case-insensitive matching.
 */

export const getDeviceType = (userAgent: string): DeviceInfo => {
  const ua = userAgent.toLowerCase()
  const isMobile = /android|iphone|ipod|blackberry|windows phone/u.test(ua)
  const isTablet = /ipad|android(?!.*mobile)|tablet/u.test(ua)

  let deviceType: DeviceType

  if (isMobile) deviceType = DeviceType.MOBILE
  else if (isTablet) deviceType = DeviceType.TABLET
  else deviceType = DeviceType.DESKTOP

  return { deviceType }
}

export function middleware(request: NextRequest) {
  // Check if this is a document request by looking at the accept header
  const acceptHeader = request.headers.get('accept') ?? ''
  const isDocumentRequest = acceptHeader.includes('text/html')

  const userAgent = request.headers.get('user-agent') ?? ''
  const deviceInfo = getDeviceType(userAgent)

  const response = NextResponse.next()

  // Only set the device type cookie if this is a document request
  if (isDocumentRequest) {
    response.cookies.set('deviceType', deviceInfo.deviceType)
  }

  // Get `CloudFront-Viewer-Country` header if exists from request and set cookie
  const country = request.headers.get('CloudFront-Viewer-Country')

  if (country) {
    response.cookies.set('country', country)
  }

  // Print the requested URL
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ [request.method]: request.nextUrl }))

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
