import { type SingleSourceChartData, type SupportedSDKNetworks } from '@summerfi/app-types'
import { parseServerResponseToClient, supportedSDKNetwork } from '@summerfi/app-utils'

import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { resolvePortfolioContext } from '@/app/server-handlers/portfolio/resolve-portfolio-context'
import { getPositionHistoricalData } from '@/helpers/chart-helpers/get-position-historical-data'

// Per-position historical chart data, deferred from the core shell and fetched on the client only
// when the position card scrolls into view. Reuses the shared context resolver so the resolved
// position/vault objects are identical to the core's — guaranteeing byte-identical chart output to
// the old bulk map. The resolver's sub-calls are cached, so repeated calls stay cheap.
export const getPortfolioPositionHistoryData = async ({
  walletAddress,
  network,
  vaultId,
}: {
  walletAddress: string
  network: SupportedSDKNetworks
  vaultId: string
}): Promise<SingleSourceChartData | null> => {
  const viewWalletAddress = walletAddress.toLowerCase()

  const { positionsWithVault, rwaFleetAddresses } = await resolvePortfolioContext({
    walletAddress: viewWalletAddress,
  })

  const match = positionsWithVault.find(
    (entry) =>
      entry.vault.id.toLowerCase() === vaultId.toLowerCase() &&
      supportedSDKNetwork(entry.vault.protocol.network) === network,
  )

  if (!match) {
    return null
  }

  const { positionHistory } = await getCachedPositionHistory({
    network,
    address: viewWalletAddress,
    vault: match.vault,
    // RWA position history comes from the institutional subgraph; rwaFleetAddresses is the reliable
    // RWA source of truth (vault.isRwaVault is unreliable for list-sourced vaults).
    isRwaVault: rwaFleetAddresses.has(match.vault.id.toLowerCase()),
  })

  return getPositionHistoricalData({
    position: match.position,
    vault: match.vault,
    positionHistory: parseServerResponseToClient(positionHistory),
  })
}
