import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDecayFactor } from '@/app/server-handlers/sumr-decay-factor'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegates } from '@/app/server-handlers/sumr-delegates'
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

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
