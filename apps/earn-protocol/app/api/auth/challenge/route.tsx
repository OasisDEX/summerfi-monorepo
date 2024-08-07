import { makeChallenge } from '@summerfi/app-tos'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const jwtChallengeSecret = process.env.EARN_PROTOCOL_JWT_CHALLENGE_SECRET

  if (!jwtChallengeSecret) {
    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  return await makeChallenge({ req, jwtChallengeSecret })
}
