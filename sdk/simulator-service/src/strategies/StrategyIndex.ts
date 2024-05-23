import { refinanceLendingToLendingSamePairStrategy } from './refinanceSamePair/Strategy'
import { refinanceLendingToLendingAnyPairStrategy } from './refinanceAnyPair/Strategy'
import { refinanceLendingToLendingNoDebtStrategy } from './refinanceNoDebt/Strategy'

/**
 * List of all strategies so the strategy definition generation tool can use them
 */
export const StrategyIndex = [
  refinanceLendingToLendingSamePairStrategy,
  refinanceLendingToLendingAnyPairStrategy,
  refinanceLendingToLendingNoDebtStrategy,
]
