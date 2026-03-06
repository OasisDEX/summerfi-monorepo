import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsBenchmark } from '@/app/server-handlers/raw-calls/get-vaults-benchmark'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedVaultsBenchmark = ({
  vaultChainId,
  vaultToken,
}: {
  vaultChainId: number
  vaultToken: string
}) => {
  const asset = ['ETH', 'WETH'].includes(vaultToken) ? 'ETH' : 'USD'

  return unstableCache(
    getVaultsBenchmark,
    ['vaultsBenchmark', vaultToken.toLowerCase(), vaultChainId.toString()],
    {
      revalidate: CACHE_TIMES.ONE_DAY,
      tags: [`${CACHE_TAGS.VAULT_PERFORMANCE}-${vaultToken.toLowerCase()}-${vaultChainId}`],
    },
  )({
    asset,
    networkId: vaultChainId,
  })
}
