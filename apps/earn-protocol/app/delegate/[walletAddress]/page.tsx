import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedSumrToClaim } from '@/app/server-handlers/cached/get-sumr-to-claim'
import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
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
    getCachedSumrToClaim(walletAddress),
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

  return <DelegatePageViewComponent walletAddress={walletAddress} externalData={externalData} />
}

export default DelegatePage
