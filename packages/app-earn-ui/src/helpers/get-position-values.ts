import { type IArmadaPosition, type SDKVaultishType } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

export const getPositionValues = (position: {
  positionData: IArmadaPosition
  vaultData: SDKVaultishType
}) => {
  const netValue = new BigNumber(position.positionData.amount.amount)

  const netDeposited = new BigNumber(
    position.positionData.deposits.reduce((acc, { amount }) => acc.plus(amount), new BigNumber(0)),
  ).minus(
    position.positionData.withdrawals.reduce(
      (acc, { amount }) => acc.plus(amount),
      new BigNumber(0),
    ),
  )

  const netEarnings = netValue.minus(netDeposited)
  const inputTokenPrice = new BigNumber(position.vaultData.inputTokenPriceUSD as string)

  return {
    netValue,
    netValueUSD: netValue.times(inputTokenPrice),
    netDeposited,
    netDepositedUSD: netDeposited.times(inputTokenPrice),
    netEarnings,
    netEarningsUSD: netEarnings.times(inputTokenPrice),
  }
}
