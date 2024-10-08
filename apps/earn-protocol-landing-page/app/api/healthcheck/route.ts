import { NextResponse } from 'next/server'

export const revalidate = 0

// eslint-disable-next-line require-await
export async function GET() {
  return NextResponse.json({ pong: true, time: Date.now() })
}
