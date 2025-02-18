import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'
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

type ClaimPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const ClaimPage = async ({ params }: ClaimPageProps) => {
  const { walletAddress } = await params

  if (!isValidAddress(walletAddress)) {
    redirect(`/`)
  }

  const cacheParams = [walletAddress]
  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_ASSETS,
    tags: [REVALIDATION_TAGS.PORTFOLIO_ASSETS, `Claim_data_${walletAddress}`],
  }

  const [sumrStakeDelegate, sumrBalances, sumrStakingInfo, sumrDelegates, sumrToClaim] =
    await Promise.all([
      unstableCache(
        getSumrDelegateStake,
        cacheParams,
        cacheConfig,
      )({
        walletAddress,
      }),
      unstableCache(
        getSumrBalances,
        cacheParams,
        cacheConfig,
      )({
        walletAddress,
      }),
      unstableCache(getSumrStakingInfo, cacheParams, cacheConfig)(),
      unstableCache(getSumrDelegates, cacheParams, cacheConfig)(),
      unstableCache(getSumrToClaim, cacheParams, cacheConfig)({ walletAddress }),
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
