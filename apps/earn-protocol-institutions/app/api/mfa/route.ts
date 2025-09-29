import { NextResponse } from 'next/server'

import {
  associateSoftwareTokenAction,
  disableMfaAction,
  getMfaInfoAction,
  setUserMfaAction,
  verifySoftwareTokenAction,
} from '@/app/server-handlers/mfa'

export async function GET() {
  try {
    const data = await getMfaInfoAction()

    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    switch (body.action) {
      case 'associate': {
        const res = await associateSoftwareTokenAction()

        return NextResponse.json({ ok: true, data: res })
      }
      case 'verify': {
        const { code } = body
        const res = await verifySoftwareTokenAction(code)

        return NextResponse.json({ ok: true, data: res })
      }
      case 'set': {
        const { mfa } = body
        const res = await setUserMfaAction(mfa)

        return NextResponse.json({ ok: true, data: res })
      }
      case 'disable': {
        const res = await disableMfaAction()

        return NextResponse.json({ ok: true, data: res })
      }
      default:
        return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 })
  }
}
