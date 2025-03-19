import { type Rebalance } from '@/graphql/clients/latest-activity/client'

export const rebalancesActionTypeMapper = (
  item: Rebalance,
): 'deposit' | 'withdraw' | 'risk_reduction' | 'rate_enhancement' | 'n/a' => {
  const actionFromRawName = item.from.name?.split('-')[0] ?? 'n/a'
  const actionToRawName = item.to.name?.split('-')[0] ?? 'n/a'

  const isFromBuffer = actionFromRawName === 'BufferArk'
  const isToBuffer = actionToRawName === 'BufferArk'

  if (!isFromBuffer && !isToBuffer && Number(item.fromPostAction.depositLimit) !== 0) {
    return Number(item.fromPostAction.totalValueLockedUSD) + Number(item.amountUSD) <
      Number(item.fromPostAction.depositLimit)
      ? 'rate_enhancement'
      : 'risk_reduction'
  }

  if (!isFromBuffer && !isToBuffer && Number(item.fromPostAction.depositLimit) === 0) {
    return 'risk_reduction'
  }

  if (isFromBuffer) {
    return 'deposit'
  }

  if (isToBuffer) {
    return 'withdraw'
  }

  // eslint-disable-next-line no-console
  console.error('Unknown rebalance purpose, fallback to n/a')

  return 'n/a'
}
