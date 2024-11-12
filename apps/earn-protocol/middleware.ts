import { getDeviceType } from '@summerfi/app-earn-ui'
import { type NextRequest, NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  const userAgent = _request.headers.get('user-agent') ?? ''
  const deviceInfo = getDeviceType(userAgent)
  // Set a cookie with the device type info
  const response = NextResponse.next()

  response.cookies.set('deviceType', deviceInfo.deviceType)

  return response
}

// Specify the paths to apply the middleware to
export const config = {
  matcher: ['/earn/:path*'],
}
