import { INTERNAL_LINKS } from '@summerfi/app-earn-ui'
import { type ProAppStats } from '@summerfi/app-types'
import { unstable_cache as unstableCache } from 'next/cache'

import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

const DEFAULT_STATS: ProAppStats = {
  monthlyVolume: 0,
  managedOnOasis: 0,
  medianVaultSize: 0,
  vaultsWithActiveTrigger: 0,
  executedTriggersLast90Days: 0,
  lockedCollateralActiveTrigger: 0,
  triggersSuccessRate: 0,
}

export const getCachedProAppStats = unstableCache(
  async (): Promise<ProAppStats> => {
    try {
      const response = await fetch(`${INTERNAL_LINKS.summerPro}/api/stats`)

      if (!response.ok) {
        return DEFAULT_STATS
      }

      return response.json()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching pro stats:', error)

      return DEFAULT_STATS
    }
  },
  ['proAppStats'],
  {
    revalidate: CACHE_TIMES.PRO_APP_STATS,
    tags: [CACHE_TAGS.PRO_APP_STATS],
  },
)
