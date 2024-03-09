import {
  AutoTakeProfitRealized,
  AutoTakeProfitSimulation,
  MinimalPositionLike,
  SimulateAutoTakeProfitParams,
} from './types'
import { calculateNextProfit } from './calculate-next-profit'
import { getEmptyProfit } from './get-empty-profit'

export const simulateAutoTakeProfit = ({
  position,
  currentStopLoss,
  minimalTriggerData,
  iterations = 15,
  logger,
}: SimulateAutoTakeProfitParams): AutoTakeProfitSimulation => {
  const emptyProfit = getEmptyProfit(position)
  const result = new Array(iterations).fill(0).reduce(
    ({ current, ranges, nextPosition: _nextPosition }) => {
      const { nextPosition, profit } = calculateNextProfit({
        lastProfit: current,
        currentPosition: _nextPosition,
        triggerData: minimalTriggerData,
        currentStopLoss,
        logger,
      })

      return {
        current: profit,
        ranges: [...ranges, profit],
        nextPosition,
      }
    },
    {
      current: emptyProfit,
      ranges: [],
      nextPosition: { ...position },
    } as {
      current: AutoTakeProfitRealized
      nextPosition: MinimalPositionLike
      ranges: AutoTakeProfitRealized[]
    },
  )

  return {
    profits: result.ranges,
  }
}
