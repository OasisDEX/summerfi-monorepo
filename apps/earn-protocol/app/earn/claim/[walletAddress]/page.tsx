import { redirect } from 'next/navigation'

import { getDelegatesVotes } from '@/app/server-handlers/delegates-votes'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
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
    redirect(`/earn`)
  }

  const [votes, { sumrDelegated, delegatedTo }] = await Promise.all([
    getDelegatesVotes(),
    getSumrDelegateStake({
      walletAddress,
    }),
  ])

  // TODO fetch external data once available and data needed for transactions
  const externalData: ClaimDelegateExternalData = {
    sumrPrice: '0',
    sumrEarned: '123.45',
    sumrToClaim: '1.23',
    sumrApy: '0.0123',
    sumrDelegated,
    delegatedTo,
    votes,
  }

  return <ClaimPageViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default ClaimPage
