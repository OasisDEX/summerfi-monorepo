import { getVaultsProtocolsList } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

// Global, tab/wallet-independent vault stats (instant liquidity + supported protocols).
// Cached as a small derived value so the vaults-list-additional-data route does not have to
// load and reduce over the full vault list on every request.
const getVaultsStatsRaw = async () => {
  const { vaults } = await getCachedVaultsList()

  const instantLiquidity = vaults.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (acc, vault) => acc + Number(vault.withdrawableTotalAssetsUSD ?? 0),
    0,
  )

  const protocolsList = getVaultsProtocolsList(vaults)

  return {
    instantLiquidity,
    protocolsList,
  }
}

export const getCachedVaultsStats = unstableCache(getVaultsStatsRaw, ['vaultsStats'], {
  revalidate: CACHE_TIMES.VAULTS_LIST,
  tags: [CACHE_TAGS.VAULTS_LIST],
})
