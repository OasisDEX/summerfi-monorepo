import {
  type EarnAppConfigType,
  type GetVaultsApyResponse,
  type IArmadaPosition,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { getCachedClaimableWSTETHMerkleRewards } from '@/app/server-handlers/cached/claimable-merkle-rewards'
import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedVaultInfo } from '@/app/server-handlers/cached/get-vault-info'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { resolveVaultManageContext } from '@/app/server-handlers/vault-manage/resolve-vault-manage-context'
import {
  getMerkleNowClaimableTokenAddress,
  getMerkleNowClaimableTokenAmount,
} from '@/helpers/merkle'

export type VaultManageCoreData = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  position: IArmadaPosition
  systemConfig: Partial<EarnAppConfigType>
  viewWalletAddress: string
  vaultInfo?: IArmadaVaultInfo
  noOfDeposits: number
  rewardTokenPrices: RewardTokenPrices
  rewardTokensClaimableNow: {
    [tokenSymbol: string]: { amount: number; tokenAddress: string }
  }
}

// Above-the-fold data the deposit/withdraw/switch sidebar + header + position value need to
// paint. Shared by the /api/vault-manage route and the server-side prefetch in the page, so the
// data has a single source of truth and the client renders straight from the hydrated cache.
export const getVaultManageCoreData = async ({
  network,
  vaultId,
  walletAddress,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
}): Promise<VaultManageCoreData | null> => {
  const ctx = await resolveVaultManageContext({ network, vaultId, walletAddress })

  if (!ctx.vault || !ctx.vaultWithConfig) {
    return null
  }

  const { systemConfig, parsedNetwork, parsedNetworkId, parsedVaultId, vault, vaultWithConfig } =
    ctx

  const { position } = ctx

  if (!position) {
    return null
  }

  const [
    vaultsApyByNetworkMap,
    vaultInfo,
    positionHistory,
    rewardTokenPrices,
    claimableWSTETHMerkleRewards,
  ] = await Promise.all([
    getCachedVaultsApy({
      fleets: ctx.allVaultsWithConfig.map(({ id, protocol: { network: vaultNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(vaultNetwork)),
      })),
    }),
    getCachedVaultInfo({ network: parsedNetwork, vaultAddress: parsedVaultId }),
    getCachedPositionHistory({
      network: parsedNetwork,
      address: walletAddress.toLowerCase(),
      vault,
    }),
    getCachedRewardTokenPrice(),
    getCachedClaimableWSTETHMerkleRewards(walletAddress),
  ])

  const rewardTokenVisibilityMap = {
    // we only show the WSTETH rewards for ETH Dao managed vault
    WSTETH:
      vault.id.toLowerCase() === '0x0c1fbccc019320032d9acd193447560c8c632114'.toLowerCase() &&
      Number(parsedNetworkId) === 1,
  }

  const rewardTokensClaimableNow: {
    [tokenSymbol: string]: { amount: number; tokenAddress: string }
  } = {
    WSTETH: rewardTokenVisibilityMap.WSTETH
      ? {
          amount: getMerkleNowClaimableTokenAmount(
            claimableWSTETHMerkleRewards.perChain['1'],
            'wstETH',
          ),
          tokenAddress: getMerkleNowClaimableTokenAddress(
            claimableWSTETHMerkleRewards.perChain['1'],
            'wstETH',
          ),
        }
      : { amount: 0, tokenAddress: '' },
  }

  return {
    vault: vaultWithConfig,
    vaults: ctx.allVaultsWithConfig,
    vaultsApyByNetworkMap,
    position: parseServerResponseToClient<IArmadaPosition>(position),
    systemConfig,
    viewWalletAddress: walletAddress,
    vaultInfo: parseServerResponseToClient(vaultInfo),
    noOfDeposits: positionHistory.noOfDeposits,
    rewardTokenPrices,
    rewardTokensClaimableNow,
  }
}
