import { redirect } from 'next/navigation'

import { ClaimPageView } from '@/components/layout/ClaimPageView/ClaimPageView'

export const revalidate = 60

type ClaimPageProps = {
  params: {
    walletAddress: string
  }
}

const ClaimPage = ({ params }: ClaimPageProps) => {
  const { walletAddress } = params

  if (!walletAddress) {
    redirect(`/earn`)
  }

  return <ClaimPageView walletAddress={walletAddress} />
}

export default ClaimPage
