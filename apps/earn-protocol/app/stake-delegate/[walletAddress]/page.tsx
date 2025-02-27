import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegatesWithDecayFactor } from '@/app/server-handlers/sumr-delegates-with-decay-factor'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
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
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
  ] = await Promise.all([
    getSumrDelegateStake({
      walletAddress,
    }),
    getSumrBalances({
      walletAddress,
    }),
    getSumrStakingInfo(),
    getSumrDelegatesWithDecayFactor(),
    getSumrToClaim({ walletAddress }),
  ])

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
