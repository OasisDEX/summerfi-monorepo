import { NextResponse } from 'next/server'

export const revalidate = 0

export function GET() {
  return NextResponse.json({ pong: true, time: Date.now() })
}
