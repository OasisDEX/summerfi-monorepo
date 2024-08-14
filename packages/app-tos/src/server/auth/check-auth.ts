import { type NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

import { verifyAccessToken } from '@/server/helpers/verify-access-token'

const paramsSchema = z.object({
  walletAddress: z.string(),
})

export const checkAuth = async ({ req, jwtSecret }: { req: NextRequest; jwtSecret: string }) => {
  const { walletAddress } = paramsSchema.parse(await req.json())

  const token = req.cookies.get(`token-${walletAddress.toLowerCase()}`)

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const decoded = verifyAccessToken({ token: token.value, jwtSecret })

  if (!decoded) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true }, { status: 200 })
}
