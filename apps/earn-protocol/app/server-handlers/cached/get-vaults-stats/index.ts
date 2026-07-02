import { getVaultsProtocolsList } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { getCachedRwaVaultsList } from '@/app/server-handlers/cached/get-rwa-vaults-list'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

// Global, tab/wallet-independent vault stats (instant liquidity + supported protocols).
// Cached as a small derived value so the vaults-list-additional-data route does not have to
// load and reduce over both full vault lists on every request.
const getVaultsStatsRaw = async () => {
  const [{ vaults }, { vaults: rwaVaults }] = await Promise.all([
    getCachedVaultsList(),
    // The RWA list is additive to these shared stats — isolate its failure so an
    // institutional-subgraph hiccup can't break instant-liquidity/protocols for the DeFi tab too.
    getCachedRwaVaultsList().catch((error: unknown) => {
      // eslint-disable-next-line no-console
      console.error('getVaultsStats: RWA vaults list failed; continuing without RWA', error)

      return { vaults: [] as Awaited<ReturnType<typeof getCachedRwaVaultsList>>['vaults'] }
    }),
  ])

  const allVaults = [...vaults, ...rwaVaults]

  const instantLiquidity = allVaults.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (acc, vault) => acc + Number(vault.withdrawableTotalAssetsUSD ?? 0),
    0,
  )

  const protocolsList = getVaultsProtocolsList(allVaults)

  return {
    instantLiquidity,
    protocolsList,
  }
}

export const getCachedVaultsStats = unstableCache(getVaultsStatsRaw, ['vaultsStats'], {
  revalidate: CACHE_TIMES.VAULTS_LIST,
  tags: [CACHE_TAGS.VAULTS_LIST, CACHE_TAGS.RWA_VAULTS_INFO],
})
