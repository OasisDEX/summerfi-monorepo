import {
  IRefinanceSimulation,
  RefinanceParameters,
  Percentage,
  SimulationSteps,
} from '@summerfi/sdk-common'
import { refinanceLendingToLending } from '../src/strategies'
import { mockRefinanceContext, mockRefinanceContextRequiredSwaps } from './mocks/contextMock'
import {
  otherTestCollateral,
  otherTestDebt,
  testSourcePosition,
  testTargetLendingPoolRequiredSwaps,
} from './mocks/testSourcePosition'

describe('Refinance', () => {
  describe('to the position with the different collateral and debt (with swaps)', () => {
    let simulation: IRefinanceSimulation
    beforeAll(async () => {
      simulation = await refinanceLendingToLending(
        RefinanceParameters.createFrom({
          sourcePosition: testSourcePosition,
          targetPool: testTargetLendingPoolRequiredSwaps,
          slippage: Percentage.createFrom({ value: 1 }),
        }),
        mockRefinanceContextRequiredSwaps,
      )
    })

    it('should include two swap steps', async () => {
      const steps = simulation.steps
        .filter((step) => !step.skip)
        .filter((step) => step.type === SimulationSteps.Swap)

      expect(steps.length).toBe(2)
    })

    it('should open position with other collateral', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.collateralAmount.token).toEqual(otherTestCollateral)
    })

    it('should open position with other debt', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.debtAmount.token).toEqual(otherTestDebt)
    })

    it('should open position as required target pool', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.pool).toEqual(testTargetLendingPoolRequiredSwaps)
    })

    it('should open position with id', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.id).toBeDefined()
    })

    it('should exchange all collateral from source position ', async () => {
      expect(
        mockRefinanceContext.swapManager.getSwapQuoteExactInput.mock.calls[0][0].fromAmount,
      ).toEqual(testSourcePosition.collateralAmount)
    })
  })
})
