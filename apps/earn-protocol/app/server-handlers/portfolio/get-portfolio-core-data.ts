import { getDisplayToken } from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
} from '@summerfi/app-types'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { ChainIds, type IDcaStrategy } from '@summerfi/sdk-common'

import { getCachedRwaReceipts } from '@/app/server-handlers/cached/get-rwa-receipts'
import { getCachedUserDcaOrders } from '@/app/server-handlers/cached/get-user-dca-orders'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { resolvePortfolioContext } from '@/app/server-handlers/portfolio/resolve-portfolio-context'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { type PortfolioRwaPendingPosition } from '@/features/portfolio/components/PortfolioOverview/PortfolioRwaPendingPositions'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'

export type PortfolioCoreData = {
  positions: PositionWithVault[]
  vaultsList: SDKVaultishType[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  dcaOrders: IDcaStrategy[]
  rwaPendingPositions: PortfolioRwaPendingPosition[]
  viewWalletAddress: string
}

// Above-the-fold portfolio shell: the position rows (+ values/APY), DCA strategies, RWA-pending
// receipts and "you might like" carousel. Shared by the /api/portfolio/core route and the
// server-side prefetch in the page, so the data has a single source of truth and the client renders
// straight from the hydrated cache. Each position's historical chart is deferred to its own
// per-position client query (loaded as the card scrolls into view) and is NOT included here.
export const getPortfolioCoreData = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<PortfolioCoreData> => {
  const viewWalletAddress = walletAddress.toLowerCase()

  const {
    systemConfig,
    vaultsWithConfig,
    allVaultsWithConfig,
    rwaVaultsWithConfig,
    positionsWithVault,
  } = await resolvePortfolioContext({ walletAddress: viewWalletAddress })

  const parsedSystemConfig = parseServerResponseToClient(systemConfig)
  const dcaEnabled = !!parsedSystemConfig.features?.DcaEnabled

  const [vaultsApyByNetworkMap, rewardTokenPrices, dcaOrders, rwaPendingPositions] =
    await Promise.all([
      getCachedVaultsApy({
        fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
          fleetAddress: id,
          chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
        })),
      }),
      getCachedRewardTokenPrice(),
      dcaEnabled
        ? getCachedUserDcaOrders({ chainId: ChainIds.Base, walletAddress: viewWalletAddress })
        : Promise.resolve([] as IDcaStrategy[]),
      // Pending RWA positions (un-settled deposit/withdraw receipts), denormalised with the display
      // fields the portfolio card needs (token + link target). One receipts read per RWA vault.
      Promise.all(
        rwaVaultsWithConfig.map(async (vault) => {
          const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))
          const receipts = await getCachedRwaReceipts({
            chainId: vaultChainId,
            fleetAddress: vault.id,
            walletAddress: viewWalletAddress,
          })

          return receipts.map(
            (receipt): PortfolioRwaPendingPosition => ({
              ...receipt,
              fleetAddress: vault.id,
              network: supportedSDKNetwork(vault.protocol.network),
              vaultId: vault.customFields?.slug ?? vault.id,
              tokenSymbol: getDisplayToken(vault.inputToken.symbol),
              tokenDecimals: vault.inputToken.decimals,
            }),
          )
        }),
      ).then((perVault) => perVault.flat()),
    ])

  return {
    positions: positionsWithVault,
    vaultsList: vaultsWithConfig,
    vaultsApyByNetworkMap,
    rewardTokenPrices,
    dcaOrders,
    rwaPendingPositions,
    viewWalletAddress,
  }
}
