import { NextResponse } from 'next/server'

import { readSession } from '@/app/server-handlers/auth/session'

export async function GET() {
  const session = await readSession()

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({ user: session.user, exp: session.exp })
}
