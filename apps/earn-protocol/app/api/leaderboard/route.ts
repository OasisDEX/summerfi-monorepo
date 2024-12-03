import { type NextRequest, NextResponse } from 'next/server'

import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'

// this route is always dynamic, but the underlying
// fetchLeaderboard call is cached, so we're good
export const revalidate = 0

export async function GET(req: NextRequest) {
  const response = await fetchRaysLeaderboard(req.nextUrl.search)

  return NextResponse.json(response)
}
