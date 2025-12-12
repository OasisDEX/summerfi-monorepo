import { unstable_cache as unstableCache } from 'next/cache'

import { getMigratablePositions } from '@/app/server-handlers/raw-calls/migration'

export const getCachedMigratablePositions = ({ walletAddress }: { walletAddress: string }) => {
  return unstableCache(getMigratablePositions, [`migrations-${walletAddress}`], {
    revalidate: 300, // 5 minutes
  })({ walletAddress })
}
