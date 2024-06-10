import { NextRequest, NextResponse } from 'next/server'

import { fetchLeaderboard } from '@/server-handlers/system-config/calls/leaderboard'

export async function GET(req: NextRequest) {
  const response = await fetchLeaderboard(req.nextUrl.search)

  return NextResponse.json(response)
}
