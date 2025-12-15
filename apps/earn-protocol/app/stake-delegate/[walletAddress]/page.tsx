import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
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
  // Get SUMR price from cookie or use default
  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  const [
    { sumrStakeDelegate, tallyDelegates },
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    { sumrRewardApy, sumrRewardAmount },
  ] = await Promise.all([
    getSumrDelegateStake({
      walletAddress,
    }).then(async (res) => {
      const delegates = await getTallyDelegates(res.delegatedToV2)

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
    getSumrStakingRewards({ walletAddress, dilutedValuation: sumrNetApyConfig?.dilutedValuation }),
  ])

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
    sumrRewardApy,
    sumrRewardAmount,
  }

  return <StakeDelegateViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default StakeDelegatePage
