import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegates } from '@/app/server-handlers/sumr-delegates'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
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

  // TODO fetch external data once available and data needed for transactions
  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    sumrDelegates,
  }

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
