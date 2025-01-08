import { isValidAddress } from '@summerfi/serverless-shared'
import { redirect } from 'next/navigation'

import { StakeDelegatePageView } from '@/components/layout/StakeDelegatePageView/StakeDelegatePageView'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

export const revalidate = 60

type StakeDelegatePageProps = {
  params: {
    walletAddress: string
  }
}

const StakeDelegatePage = ({ params }: StakeDelegatePageProps) => {
  const { walletAddress } = params

  if (!isValidAddress(walletAddress)) {
    redirect(`/earn`)
  }

  // TODO fetch external data once available and data needed for transactions
  const externalData: ClaimDelegateExternalData = {
    sumrPrice: '0',
    sumrEarned: '123.12',
    sumrApy: '0.032',
    sumrDelegated: '50',
  }

  return <StakeDelegatePageView walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
