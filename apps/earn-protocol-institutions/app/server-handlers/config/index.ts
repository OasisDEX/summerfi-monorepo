import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import dayjs from 'dayjs'
import { unstable_cache as unstableCache } from 'next/cache'

import { CHART_TIMESTAMP_FORMAT_DETAILED } from '@/features/charts/helpers'

// creating a dynamic 5 minute cache tag to make sure config is fetched every 5 minutes
const everyFiveMinutes = () => {
  const now = dayjs()
  const minutes = Math.floor(now.minute() / 5) * 5

  const tag = now.minute(minutes).second(0).millisecond(0).format(CHART_TIMESTAMP_FORMAT_DETAILED)

  return tag
}

export const getCachedConfig = async () => {
  const fiveMinuteTag = everyFiveMinutes()

  return await unstableCache(configEarnAppFetcher, ['config-earn-app'], {
    revalidate: 300,
    tags: ['config-earn-app', fiveMinuteTag],
  })()
}
