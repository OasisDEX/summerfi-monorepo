import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)

  const { pathname } = url

  if (pathname === '/claimed') {
    const userAddress = url.searchParams.get('userAddress')

    if (!userAddress) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Specify the paths to apply the middleware to
export const config = {
  matcher: ['/claimed'],
}
