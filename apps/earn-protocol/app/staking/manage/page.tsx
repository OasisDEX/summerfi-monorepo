import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'

import { SumrV2StakingManageView } from '@/components/layout/SumrV2StakingManageView/SumrV2StakingManageView'

const SumrStakingManagePage = async () => {
  const [configRaw] = await Promise.all([
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
      tags: [REVALIDATION_TAGS.CONFIG],
    })(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)

  return systemConfig.features?.StakingV2 ? <SumrV2StakingManageView /> : null
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Staking`,
    description:
      'Stake your $SUMR tokens and earn rewards with Summer Protocol. Enjoy flexible staking options and maximize your returns in the Summer ecosystem.',
  }
}

export default SumrStakingManagePage
