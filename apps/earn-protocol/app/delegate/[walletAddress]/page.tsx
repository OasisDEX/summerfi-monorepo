import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedSumrToClaim } from '@/app/server-handlers/cached/get-sumr-to-claim'
import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
import { DelegatePageViewComponent } from '@/components/layout/DelegatePageView/DelegatePageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { isValidAddress } from '@/helpers/is-valid-address'

type DelegatePageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const DelegatePage = async ({ params }: DelegatePageProps) => {
  const [{ walletAddress }, cookieRaw, sumrPrice, config] = await Promise.all([
    params,
    cookies(),
    getCachedSumrPrice(),
    getCachedConfig(),
  ])
  // Get SUMR price from cookie or use default
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

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
    getSumrStakingRewards({ walletAddress, sumrPriceUsd }),
  ])

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
    sumrRewardApy,
    sumrRewardAmount,
    authorizedStakingRewardsCallerBase: false, // not used on this screen (delegate and stake is separated now), needed for type safety
  }

  return (
    <DelegatePageViewComponent
      walletAddress={walletAddress}
      externalData={externalData}
      sumrPriceUsd={sumrPriceUsd}
    />
  )
}

export default DelegatePage
