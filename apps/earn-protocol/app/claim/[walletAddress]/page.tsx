import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDecayFactor } from '@/app/server-handlers/sumr-decay-factor'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegates } from '@/app/server-handlers/sumr-delegates'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
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

  const [sumrStakeDelegate, sumrBalances, sumrStakingInfo, sumrDelegates, sumrToClaim] =
    await Promise.all([
      getSumrDelegateStake({
        walletAddress,
      }),
      getSumrBalances({
        walletAddress,
      }),
      getSumrStakingInfo(),
      getSumrDelegates(),
      getSumrToClaim({ walletAddress }),
    ])

  const sumrDecayFactors = await getSumrDecayFactor(
    sumrDelegates.map((delegate) => delegate.account.address),
  )

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  return <ClaimPageViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default ClaimPage
