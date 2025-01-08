import { redirect } from 'next/navigation'

import { ClaimPageView } from '@/components/layout/ClaimPageView/ClaimPageView'
import { isValidAddress } from '@/helpers/is-valid-address'

export const revalidate = 60

type ClaimPageProps = {
  params: {
    walletAddress: string
  }
}

const ClaimPage = ({ params }: ClaimPageProps) => {
  const { walletAddress } = params

  if (!isValidAddress(walletAddress)) {
    redirect(`/earn`)
  }

  // TODO fetch external data once available and data needed for transactions
  const sumrPrice = '0'
  const sumrEarned = '123.12'
  const sumrApy = '0.032'
  const sumrDelegated = '50'

  return (
    <ClaimPageView
      walletAddress={walletAddress}
      externalData={{ sumrPrice, sumrEarned, sumrApy, sumrDelegated }}
    />
  )
}

export default ClaimPage
