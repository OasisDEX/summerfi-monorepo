import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import {
  fetchRwaReceiptsHistoryPage,
  type RwaReceiptHistorySide,
  type RwaReceiptsHistoryPage,
} from '@/app/server-handlers/rwa-receipts-history/get-rwa-receipts-history'
import { rwaSubgraphsMap } from '@/app/server-handlers/subgraphs-map'
import { resolveVaultManageContext } from '@/app/server-handlers/vault-manage/resolve-vault-manage-context'

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

const isRwaSubgraphNetwork = (net: string): net is keyof typeof rwaSubgraphsMap =>
  net in rwaSubgraphsMap

const toInt = (value: string | null, fallback: number): number => {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

// Paginated (load-more) RWA deposit/withdrawal history for one fleet + wallet, one side per call.
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ network: string; vaultId: string; walletAddress: string }>
  },
) {
  const { network, vaultId, walletAddress } = await params
  const { searchParams } = new URL(request.url)

  const side: RwaReceiptHistorySide =
    searchParams.get('side') === 'withdrawal' ? 'withdrawal' : 'deposit'
  const page = Math.max(0, toInt(searchParams.get('page'), 0))
  const limit = Math.min(MAX_LIMIT, Math.max(1, toInt(searchParams.get('limit'), DEFAULT_LIMIT)))

  const emptyPage: RwaReceiptsHistoryPage = { rows: [], page, hasMore: false }

  const ctx = await resolveVaultManageContext({
    network: network as SupportedSDKNetworks,
    vaultId,
    walletAddress,
    withPosition: false,
  })

  // Non-RWA vaults have no rounds-vault receipts, and only Mainnet/Base have an RWA subgraph.
  if (!ctx.isRwaVault || !ctx.parsedVaultId || !isRwaSubgraphNetwork(ctx.parsedNetwork)) {
    return NextResponse.json(emptyPage)
  }

  const data = await fetchRwaReceiptsHistoryPage({
    subgraphUrl: rwaSubgraphsMap[ctx.parsedNetwork],
    fleetAddress: ctx.parsedVaultId,
    walletAddress,
    side,
    page,
    limit,
  })

  return NextResponse.json(data)
}
