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
  // get the latest withdraw event which ended up in empty position
  const latestWithdrawEmptyPositionTimestamp = position.withdrawals
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .find((withdraw) => withdraw.inputTokenBalance.toString() === '0')?.timestamp

  // get the first deposit event after the latest withdraw event which ended up in empty position
  const firstDepositTimestampAfterEmptyPosition = latestWithdrawEmptyPositionTimestamp
    ? position.deposits
        .filter(
          (deposit) => Number(deposit.timestamp) > Number(latestWithdrawEmptyPositionTimestamp),
        )
        .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))[0]?.timestamp
    : undefined

  // first deposit event
  const firstDepositTimestamp = position.deposits.sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  )[0]?.timestamp

  const timestamp = firstDepositTimestampAfterEmptyPosition ?? firstDepositTimestamp

  return timestamp ? Number(timestamp) * 1000 : 0
}
