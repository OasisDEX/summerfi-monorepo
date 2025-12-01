import { redirect } from 'next/navigation'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { getTallyDelegates } from '@/app/server-handlers/tally'
import { DelegatePageViewComponent } from '@/components/layout/DelegatePageView/DelegatePageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { isValidAddress } from '@/helpers/is-valid-address'

type DelegatePageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const DelegatePage = async ({ params }: DelegatePageProps) => {
  const { walletAddress } = await params

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  const [{ sumrStakeDelegate, tallyDelegates }, sumrBalances, sumrStakingInfo, sumrToClaim] =
    await Promise.all([
      getSumrDelegateStake({
        walletAddress,
      }).then(async (res) => {
        const delegates = await getTallyDelegates(res.delegatedTo)

        return {
          sumrStakeDelegate: res,
          tallyDelegates: delegates,
        }
      }),
      getSumrBalances({
        walletAddress,
      }),
      getSumrStakingInfo(),
      getSumrToClaim({ walletAddress }),
    ])

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
  }

  return <DelegatePageViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default DelegatePage
