import { getPastTimestamp } from '@summerfi/app-utils'
import { type Position } from '@summerfi/subgraph-manager-common'
import BigNumber from 'bignumber.js'

export const calculateTopDepositors7daysChange = ({ position }: { position: Position }) => {
  const timeStamp7daysAgo = getPastTimestamp(7)

  const depositsFromLast7Days = position.deposits
    .filter((deposit) => Number(deposit.timestamp) * 1000 > timeStamp7daysAgo)
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const withdrawalsFromLast7Days = position.withdrawals
    .filter((withdraw) => Number(withdraw.timestamp) * 1000 > timeStamp7daysAgo)
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  // plus since withdrawals are already negative
  return new BigNumber(depositsFromLast7Days + withdrawalsFromLast7Days).shiftedBy(
    -position.vault.inputToken.decimals,
  )
}

export const getEarningStreakResetTimestamp = ({ position }: { position: Position }) => {
  // get withdraw event which ended up in empty position
  const earnStreakWithdrawResetTimestamp = position.withdrawals.find(
    (withdraw) => Number(withdraw.inputTokenBalance) === 0,
  )?.timestamp
  // first deposit event
  const firstDepositTimestamp = position.deposits[0]?.timestamp

  const timestamp = earnStreakWithdrawResetTimestamp ?? firstDepositTimestamp

  return timestamp ? Number(timestamp) * 1000 : 0
}
