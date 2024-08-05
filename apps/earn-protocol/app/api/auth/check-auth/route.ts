import { checkAuth } from '@summerfi/app-tos'
import { type NextRequest, NextResponse } from 'next/server'

export function GET(req: NextRequest) {
  const jwtSecret = process.env.EARN_PROTOCOL_JWT_SECRET

  if (!jwtSecret) {
    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  return checkAuth({ req, jwtSecret })
}
