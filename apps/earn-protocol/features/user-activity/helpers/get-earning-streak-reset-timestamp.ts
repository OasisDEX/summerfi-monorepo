import { type SDKUserActivityType } from '@summerfi/app-types'

export const getEarningStreakResetTimestamp = (userActivity: SDKUserActivityType) => {
  // get withdraw event which ended up in empty position
  const earnStreakWithdrawResetTimestamp = userActivity.withdrawals.find(
    (withdraw) => Number(withdraw.inputTokenBalance) === 0,
  )?.timestamp
  // first deposit event
  const firstDepositTimestamp = userActivity.deposits[0]?.timestamp

  return Number(earnStreakWithdrawResetTimestamp ?? firstDepositTimestamp) * 1000
}
