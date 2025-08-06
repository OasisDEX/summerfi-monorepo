import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode token to get user info
    const payload = decodeJwt(accessToken)

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth check error:', error)

    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
