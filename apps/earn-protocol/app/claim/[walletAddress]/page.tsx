import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { getTallyDelegates } from '@/app/server-handlers/tally'
import { ClaimPageViewComponent } from '@/components/layout/ClaimPageView/ClaimPageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { isValidAddress } from '@/helpers/is-valid-address'

type ClaimPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
  const { walletAddress } = await params

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }
  const [
    { sumrStakeDelegate, tallyDelegates },
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    systemConfigRaw,
  ] = await Promise.all([
    getSumrDelegateStake({
      walletAddress,
    }).then(async (res) => {
      const delegates = await getTallyDelegates(res.delegatedToV2)

      return {
        sumrStakeDelegate: res,
        tallyDelegates: delegates,
      }
    }),
    getSumrBalances({
      walletAddress,
    }),
    getSumrStakingInfo(),
    getSumrToClaim({ walletAddress }),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
      tags: [REVALIDATION_TAGS.CONFIG],
    })(),
  ])

  const systemConfig = parseServerResponseToClient(systemConfigRaw)

  const stakingV2Enabled = systemConfig.features?.StakingV2

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
  }

  return (
    <ClaimPageViewComponent
      walletAddress={walletAddress}
      externalData={externalData}
      stakingV2Enabled={stakingV2Enabled}
    />
  )
}

export default ClaimPage
