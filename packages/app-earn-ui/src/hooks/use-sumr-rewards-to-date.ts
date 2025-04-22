import { useMemo } from 'react'
import { zero } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

export const useSumrRewardsToDate = (portfolioPosition: IArmadaPosition): BigNumber => {
  const sumrRewards = useMemo(() => {
    const sumrReward = portfolioPosition.rewards.find((reward) => {
      return reward.claimed.token.symbol === 'SUMR'
    })

    if (!sumrReward) {
      return zero
    }

    return new BigNumber(sumrReward.claimable.amount).plus(new BigNumber(sumrReward.claimed.amount))
  }, [portfolioPosition.rewards])

  return sumrRewards
}
