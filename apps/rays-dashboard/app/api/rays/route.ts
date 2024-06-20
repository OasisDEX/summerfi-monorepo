import { NextRequest, NextResponse } from 'next/server'

import { fetchRays } from '@/server-handlers/rays'

// this route is always dynamic, but the underlying
// fetchRays call is cached, so we're good
export const revalidate = 0

export async function GET(req: NextRequest) {
  const response = await fetchRays(req.nextUrl.search)

  return NextResponse.json(response)
}
