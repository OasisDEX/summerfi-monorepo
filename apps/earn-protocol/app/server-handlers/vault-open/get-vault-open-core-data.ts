import {
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type SupportedSDKNetworks,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
import { cookies } from 'next/headers'

import { getCachedMedianDefiYield } from '@/app/server-handlers/cached/defillama/get-median-defi-yield'
import { getCachedVaultInfo } from '@/app/server-handlers/cached/get-vault-info'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsBenchmark } from '@/app/server-handlers/cached/get-vaults-benchmark'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { resolveVaultOpenContext } from '@/app/server-handlers/vault-open/resolve-vault-open-context'

export type VaultOpenCoreData = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  vaultApyData: VaultApyData
  medianDefiYield?: number
  rewardTokenPrices: RewardTokenPrices
  referralCode?: string
}

// Above-the-fold data the deposit sidebar + header grid need to paint. Shared by the
// /api/vault-open route and the server-side prefetch in the page, so the data has a single
// source of truth and the client renders straight from the hydrated cache.
export const getVaultOpenCoreData = async ({
  network,
  vaultId,
}: {
  network: SupportedSDKNetworks
  vaultId: string
}): Promise<VaultOpenCoreData | null> => {
  const ctx = await resolveVaultOpenContext({ network, vaultId })

  if (!ctx.vaultWithConfig) {
    return null
  }

  const { parsedNetwork, parsedVaultId, vaultWithConfig, allVaultsWithConfig } = ctx

  const [
    cookieRaw,
    vaultInfo,
    vaultsApyRaw,
    { apy30d: vaultBenchmarkApy30d },
    medianDefiYield,
    rewardTokenPrices,
  ] = await Promise.all([
    cookies(),
    getCachedVaultInfo({ network: parsedNetwork, vaultAddress: parsedVaultId }),
    getCachedVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network: vaultNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(vaultNetwork)),
      })),
    }),
    getCachedVaultsBenchmark({
      vaultChainId: subgraphNetworkToId(parsedNetwork),
      vaultToken: vaultWithConfig.inputToken.symbol,
    }),
    getCachedMedianDefiYield(),
    getCachedRewardTokenPrice(),
  ])

  const referralCode = getServerSideCookies('referralCode', cookieRaw.toString())

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const vaultApyData = vaultsApyRaw[
    `${vaultWithConfig.id}-${subgraphNetworkToId(supportedSDKNetwork(vaultWithConfig.protocol.network))}`
  ] || { sma7d: null, sma30d: null, current: null }

  const resolvedMedianDefiYield =
    vaultBenchmarkApy30d && Number(Number(vaultBenchmarkApy30d) * 100) > 0
      ? Number(vaultBenchmarkApy30d) * 100
      : medianDefiYield

  return {
    vault: vaultWithConfig,
    vaults: allVaultsWithConfig,
    vaultInfo: parseServerResponseToClient(vaultInfo),
    vaultApyData,
    medianDefiYield: resolvedMedianDefiYield,
    rewardTokenPrices,
    referralCode,
  }
}
