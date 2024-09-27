import { type NextRequest, NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

// Specify the paths to apply the middleware to
export const config = {
  matcher: [],
}
