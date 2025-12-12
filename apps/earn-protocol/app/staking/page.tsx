import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { SumrV2StakingLandingPageView } from '@/components/layout/SumrV2StakingLandingPageView/SumrV2StakingLandingPageView'

const SumrStakingLandingPage = async () => {
  const [configRaw] = await Promise.all([getCachedConfig()])
  const systemConfig = parseServerResponseToClient(configRaw)

  return systemConfig.features?.StakingV2 ? <SumrV2StakingLandingPageView /> : null
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Staking`,
    description:
      'Stake your $SUMR tokens and earn rewards with Summer Protocol. Enjoy flexible staking options and maximize your returns in the Summer ecosystem.',
  }
}

export default SumrStakingLandingPage
