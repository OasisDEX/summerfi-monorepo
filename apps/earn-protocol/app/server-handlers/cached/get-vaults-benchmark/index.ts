import { chainIdToSDKNetwork, sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsBenchmark } from '@/app/server-handlers/raw-calls/get-vaults-benchmark'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getVaultPerformanceTag } from '@/helpers/get-cache-handler-name'

export const getCachedVaultsBenchmark = ({
  vaultChainId,
  vaultToken,
}: {
  vaultChainId: number
  vaultToken: string
}) => {
  const vaultPerformanceAsset = ['ETH', 'WETH'].includes(vaultToken.toUpperCase()) ? 'ETH' : 'USD'
  const chainName = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(vaultChainId))

  return unstableCache(getVaultsBenchmark, ['vaultsBenchmark'], {
    revalidate: CACHE_TIMES.ONE_DAY,
    tags: [getVaultPerformanceTag(chainName, vaultPerformanceAsset)],
  })({
    vaultPerformanceAsset,
    networkId: vaultChainId,
  })
}
