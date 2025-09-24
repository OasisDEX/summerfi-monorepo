import { useMemo } from 'react'
import { type IArmadaPosition } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

export const useSumrRewardsToDate = (portfolioPosition: IArmadaPosition): BigNumber => {
  const sumrRewards = useMemo(() => {
    return new BigNumber(portfolioPosition.claimableSummerToken.amount).plus(
      new BigNumber(portfolioPosition.claimedSummerToken.amount),
    )
  }, [portfolioPosition.claimableSummerToken, portfolioPosition.claimedSummerToken])

  return sumrRewards
}
