import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { resolvePortfolioContext } from '@/app/server-handlers/portfolio/resolve-portfolio-context'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'

export type PortfolioCoreData = {
  positions: PositionWithVault[]
  vaultsList: SDKVaultishType[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  viewWalletAddress: string
}

// Above-the-fold portfolio shell: the position rows (+ values/APY) and "you might like" carousel.
// Shared by the /api/portfolio/core route and the server-side prefetch in the page, so the data has
// a single source of truth and the client renders straight from the hydrated cache. Each position's
// historical chart is deferred to its own per-position client query (loaded as the card scrolls into
// view) and is NOT included here.
export const getPortfolioCoreData = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<PortfolioCoreData> => {
  const viewWalletAddress = walletAddress.toLowerCase()

  const { vaultsWithConfig, allVaultsWithConfig, positionsWithVault } =
    await resolvePortfolioContext({ walletAddress: viewWalletAddress })

  const [vaultsApyByNetworkMap, rewardTokenPrices] = await Promise.all([
    getCachedVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getCachedRewardTokenPrice(),
  ])

  return {
    positions: positionsWithVault,
    vaultsList: vaultsWithConfig,
    vaultsApyByNetworkMap,
    rewardTokenPrices,
    viewWalletAddress,
  }
}
