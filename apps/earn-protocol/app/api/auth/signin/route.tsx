import { makeSignIn } from '@summerfi/app-tos'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const jwtSecret = process.env.EARN_PROTOCOL_JWT_SECRET
  const jwtChallengeSecret = process.env.EARN_PROTOCOL_JWT_CHALLENGE_SECRET
  const rpcGateway = process.env.RPC_GATEWAY

  if (!rpcGateway) {
    return NextResponse.json({ error: 'RPC_GATEWAY is not set' }, { status: 500 })
  }

  if (!jwtSecret || !jwtChallengeSecret) {
    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  return await makeSignIn({
    req,
    jwtChallengeSecret,
    jwtSecret,
    rpcGateway,
  })
}
