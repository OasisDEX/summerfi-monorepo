import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

export const getCachedConfig = async () => {
  return await unstableCache(configEarnAppFetcher, ['config-earn-app'], {
    revalidate: 300,
    tags: ['config-earn-app'],
  })()
}
