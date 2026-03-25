import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
} from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedSumrBalances } from '@/app/server-handlers/cached/get-sumr-balances'
import { getCachedSumrToClaim } from '@/app/server-handlers/cached/get-sumr-to-claim'
import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import {
  getIsAuthorizedStakingRewardsCallerBase,
  getSumrStakingRewards,
} from '@/app/server-handlers/sumr-staking-rewards'
import { ClaimPageViewComponent } from '@/components/layout/ClaimPageView/ClaimPageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { isValidAddress } from '@/helpers/is-valid-address'

type ClaimPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
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
    authorizedStakingRewardsCallerBase,
    { sumrStakeDelegate, tallyDelegates },
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    systemConfigRaw,
    { sumrRewardApy, sumrRewardAmount },
  ] = await Promise.all([
    getIsAuthorizedStakingRewardsCallerBase({
      ownerAddress: walletAddress,
    }),
    getSumrDelegateStake({
      walletAddress,
    }).then(async (res) => {
      const delegates = await getTallyDelegates(res.delegatedToV2)

      return {
        sumrStakeDelegate: res,
        tallyDelegates: delegates,
      }
    }),
    getCachedSumrBalances({ walletAddress }),
    getSumrStakingInfo(),
    getCachedSumrToClaim(walletAddress),
    getCachedConfig(),
    getSumrStakingRewards({ walletAddress, sumrPriceUsd }),
  ])

  const systemConfig = parseServerResponseToClient(systemConfigRaw)

  const stakingV2Enabled = systemConfig.features?.StakingV2

  const externalData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    tallyDelegates,
    sumrRewardApy,
    sumrRewardAmount,
    authorizedStakingRewardsCallerBase,
  }

  return (
    <ClaimPageViewComponent
      walletAddress={walletAddress}
      externalData={externalData}
      stakingV2Enabled={stakingV2Enabled}
      sumrPriceUsd={sumrPriceUsd}
    />
  )
}

export default ClaimPage
