import { NextRequest, NextResponse } from 'next/server'

import { fetchLeaderboard } from '@/server-handlers/leaderboard'

export async function GET(req: NextRequest) {
  const response = await fetchLeaderboard(req.nextUrl.search)

  return NextResponse.json(response)
}
