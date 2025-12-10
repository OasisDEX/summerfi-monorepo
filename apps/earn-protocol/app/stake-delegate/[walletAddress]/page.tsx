import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { getTallyDelegates } from '@/app/server-handlers/tally'
import { StakeDelegateViewComponent } from '@/components/layout/StakeDelegatePageView/StakeDelegateViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { isValidAddress } from '@/helpers/is-valid-address'

type StakeDelegatePageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const StakeDelegatePage = async ({ params }: StakeDelegatePageProps) => {
  const { walletAddress } = await params

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  const [
    { sumrStakeDelegate, tallyDelegates },
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    { sumrRewardApy, sumrRewardAmount },
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
    getSumrStakingRewards({ walletAddress }),
  ])

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
    sumrRewardApy,
    sumrRewardAmount,
  }

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
