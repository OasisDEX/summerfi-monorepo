import { NextResponse } from 'next/server'

import {
  isOkxCampaignWallet,
  saveOkxWallet,
} from '@/app/server-handlers/raw-calls/campaigns/okx-handlers'

export async function GET(req: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  if (!address) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  const okxWallet = await isOkxCampaignWallet(address)

  return NextResponse.json({ okxWallet })
}

export async function POST(req: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  if (!address) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  const savedData = await saveOkxWallet(address)

  if (!savedData) {
    return NextResponse.json(
      { error: 'Failed to save OKX wallet', okxWallet: false },
      { status: 500 },
    )
  }

  return NextResponse.json({ okxWallet: true })
}
