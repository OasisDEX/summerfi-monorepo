import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
} from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { ClaimPageViewComponent } from '@/components/layout/ClaimPageView/ClaimPageViewComponent'
import { CACHE_TIMES } from '@/constants/revalidation'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'
import { isValidAddress } from '@/helpers/is-valid-address'

type ClaimPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
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
    systemConfigRaw,
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
    unstableCache(getSumrBalances, [], {
      revalidate: CACHE_TIMES.USER_DATA,
      tags: [getUserDataCacheHandler(walletAddress)],
    })({
      walletAddress,
    }),
    getSumrStakingInfo(),
    unstableCache(getSumrToClaim, [], {
      revalidate: CACHE_TIMES.USER_DATA,
      tags: [getUserDataCacheHandler(walletAddress)],
    })({ walletAddress }),
    getCachedConfig(),
    getSumrStakingRewards({ walletAddress, dilutedValuation: sumrNetApyConfig?.dilutedValuation }),
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
  }

  return (
    <ClaimPageViewComponent
      walletAddress={walletAddress}
      externalData={externalData}
      stakingV2Enabled={stakingV2Enabled}
    />
  )
}

export default ClaimPage
