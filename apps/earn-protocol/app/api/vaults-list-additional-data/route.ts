import { NextResponse } from 'next/server'

import { getVaultsListAdditionalData } from '@/app/server-handlers/vaults-list/get-vaults-list-additional-data'

export async function GET() {
  return NextResponse.json(await getVaultsListAdditionalData())
}
