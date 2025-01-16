import { redirect } from 'next/navigation'

import { getDelegatesVotes } from '@/app/server-handlers/delegates-votes'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { ClaimPageViewComponent } from '@/components/layout/ClaimPageView/ClaimPageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { isValidAddress } from '@/helpers/is-valid-address'

export const revalidate = 60

type ClaimPageProps = {
  params: {
    walletAddress: string
  }
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
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

  return <ClaimPageViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default ClaimPage
