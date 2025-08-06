import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AuthService } from '@/features/auth/AuthService'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (accessToken) {
      await AuthService.signOut(accessToken)
    }

    // Clear cookies
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')

    return NextResponse.json({ success: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Sign out error:', error)

    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 })
  }
}
