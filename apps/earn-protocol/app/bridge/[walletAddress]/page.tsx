import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { BridgePageViewComponent } from '@/components/layout/BridgePageView/BridgePageViewComponent'
import { type BridgeExternalData } from '@/features/bridge/types'
import { isValidAddress } from '@/helpers/is-valid-address'

type BridgePageProps = {
  params: {
    walletAddress: string
  }
}

const BridgePage = async ({ params }: BridgePageProps) => {
  const { walletAddress } = params

  if (!isValidAddress(walletAddress)) {
    redirect(`/`)
  }
  const [sumrBalances] = await Promise.all([
    getSumrBalances({
      walletAddress,
    }),
  ])

  // TODO: Uodate to simply SUMR balance
  const externalData: BridgeExternalData = {
    sumrBalances,
  }

  return <BridgePageViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default BridgePage
