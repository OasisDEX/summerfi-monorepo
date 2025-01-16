import { redirect } from 'next/navigation'

import { getDelegatesVotes } from '@/app/server-handlers/delegates-votes'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { StakeDelegateViewComponent } from '@/components/layout/StakeDelegatePageView/StakeDelegateViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { isValidAddress } from '@/helpers/is-valid-address'

export const revalidate = 60

type StakeDelegatePageProps = {
  params: {
    walletAddress: string
  }
}

const StakeDelegatePage = async ({ params }: StakeDelegatePageProps) => {
  const { walletAddress } = params

  if (!isValidAddress(walletAddress)) {
    redirect(`/`)
  }

  const [votes, sumrStakeDelegate, sumrBalances, sumrStakingInfo] = await Promise.all([
    getDelegatesVotes(),
    getSumrDelegateStake({
      walletAddress,
    }),
    getSumrBalances({
      walletAddress,
    }),
    getSumrStakingInfo(),
  ])

  // TODO fetch external data once available and data needed for transactions
  const externalData: ClaimDelegateExternalData = {
    sumrEarned: '123.45',
    sumrToClaim: '1.23',
    sumrStakeDelegate,
    votes,
    sumrBalances,
    sumrStakingInfo,
  }

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
