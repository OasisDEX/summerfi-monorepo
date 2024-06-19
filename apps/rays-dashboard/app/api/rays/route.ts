import { NextRequest, NextResponse } from 'next/server'

import { fetchRays } from '@/server-handlers/rays'

export async function GET(req: NextRequest) {
  const response = await fetchRays(req.nextUrl.search)

  return NextResponse.json(response)
}
