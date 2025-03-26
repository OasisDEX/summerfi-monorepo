import { type Rebalance } from '@summerfi/subgraph-manager-common'

export const rebalancesActionTypeMapper = (
  item: Rebalance,
): 'deposit' | 'withdraw' | 'risk_reduction' | 'rate_enhancement' | 'n/a' => {
  const actionFromRawName = item.from.name?.split('-')[0] ?? 'n/a'
  const actionToRawName = item.to.name?.split('-')[0] ?? 'n/a'

  const isFromBuffer = actionFromRawName === 'BufferArk'
  const isToBuffer = actionToRawName === 'BufferArk'

  // TODO: we need to think about more specifc logic to handle this
  // if (!isFromBuffer && !isToBuffer && Number(item.fromPostAction.depositLimit) !== 0) {
  //   return Number(item.fromPostAction.totalValueLockedUSD) + Number(item.amountUSD) <
  //     Number(item.fromPostAction.depositLimit)
  //     ? 'rate_enhancement'
  //     : 'risk_reduction'
  // }

  if (!isFromBuffer && !isToBuffer) {
    return 'rate_enhancement'
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
