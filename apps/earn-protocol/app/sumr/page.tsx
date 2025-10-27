import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'

import { SumrPageView } from '@/components/layout/SumrPageView/SumrPageView'
import { SumrV2PageView } from '@/components/layout/SumrV2PageView/SumrV2PageView'

const SumrPage = async () => {
  const [configRaw] = await Promise.all([
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
      tags: [REVALIDATION_TAGS.CONFIG],
    })(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)

  return systemConfig.features?.StakingV2 ? <SumrV2PageView /> : <SumrPageView />
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Token`,
    description:
      'Check if you are eligible for $SUMR - the token that powers DeFi’s best yield optimizer.',
  }
}

export default SumrPage
