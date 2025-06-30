import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
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

  const [sumrStakeDelegate, sumrBalances, sumrStakingInfo, sumrToClaim, tallyDelegates] =
    await Promise.all([
      getSumrDelegateStake({
        walletAddress,
      }),
      getSumrBalances({
        walletAddress,
      }),
      getSumrStakingInfo(),
      getSumrToClaim({ walletAddress }),
      getTallyDelegates(),
    ])

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
  }

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
