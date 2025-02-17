import { type IArmadaPosition, type SDKVaultishType } from '@summerfi/app-types'
import { zero } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

export type PositionValues = {
  netValue: BigNumber
  netValueUSD: BigNumber
  netDeposited: BigNumber
  netDepositedUSD: BigNumber
  netEarnings: BigNumber
  netEarningsUSD: BigNumber
}

export const getPositionValues = (position: {
  positionData: IArmadaPosition
  vaultData: SDKVaultishType
}) => {
  const netValue = new BigNumber(position.positionData.amount.amount)

  const depositsSum = position.positionData.deposits.reduce(
    (acc, { amount }) => acc.plus(amount),
    new BigNumber(0),
  )
  const withdrawalsSum = position.positionData.withdrawals.reduce(
    (acc, { amount }) => acc.plus(amount), // these are NEGATIVE values
    new BigNumber(0),
  )

  const netDeposited = depositsSum.plus(withdrawalsSum)
  const netEarnings = netValue.minus(netDeposited)
  const inputTokenPrice = new BigNumber(position.vaultData.inputTokenPriceUSD ?? 0)

  return {
    netValue,
    netValueUSD: netValue.times(inputTokenPrice),
    netDeposited: netDeposited.lt(0) ? zero : netDeposited,
    netDepositedUSD: netDeposited.times(inputTokenPrice),
    netEarnings,
    netEarningsUSD: netEarnings.times(inputTokenPrice),
  } as PositionValues
}
