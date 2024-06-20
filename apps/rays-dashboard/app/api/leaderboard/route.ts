import { NextRequest, NextResponse } from 'next/server'

import { fetchLeaderboard } from '@/server-handlers/leaderboard'

// this route is always dynamic, but the underlying
// fetchLeaderboard call is cached, so we're good
export const revalidate = 0

export async function GET(req: NextRequest) {
  const response = await fetchLeaderboard(req.nextUrl.search)

  return NextResponse.json(response)
}
