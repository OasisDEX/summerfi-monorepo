import { type IArmadaPosition, type SDKVaultishType } from '@summerfi/app-types'
import { zero } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

type PositionValues = {
  netValue: BigNumber
  netValueUSD: BigNumber
  netDeposited: BigNumber
  netDepositedUSD: BigNumber
  netEarnings: BigNumber
  netEarningsUSD: BigNumber
}

export const getPositionValues = (portfolioPosition: {
  position: IArmadaPosition
  vault: SDKVaultishType
}) => {
  const netValue = new BigNumber(portfolioPosition.position.amount.amount)

  const depositsSum = portfolioPosition.position.deposits.reduce(
    (acc, { amount }) => acc.plus(amount.amount),
    new BigNumber(0),
  )
  const withdrawalsSum = portfolioPosition.position.withdrawals.reduce(
    (acc, { amount }) => acc.plus(amount.amount), // these are NEGATIVE values
    new BigNumber(0),
  )

  const netDeposited = depositsSum.plus(withdrawalsSum)
  const netEarnings = netValue.minus(netDeposited)
  const inputTokenPrice = new BigNumber(portfolioPosition.vault.inputTokenPriceUSD ?? 0)

  return {
    netValue,
    netValueUSD: netValue.times(inputTokenPrice),
    netDeposited: netDeposited.lt(0) ? zero : netDeposited,
    netDepositedUSD: netDeposited.times(inputTokenPrice),
    netEarnings,
    netEarningsUSD: netEarnings.times(inputTokenPrice),
  } as PositionValues
}
