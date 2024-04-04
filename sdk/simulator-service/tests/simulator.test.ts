import { Percentage } from '@summerfi/sdk-common/common'
import {
  ISimulation,
  SimulationSteps,
  SimulationType,
  steps,
} from '@summerfi/sdk-common/simulation'
import {
  refinanceLendingToLendingAnyPair,
  refinanceLendingToLendingSamePair,
} from '../src/strategies'
import {
  otherTestCollateral,
  otherTestDebt,
  testSourcePosition,
  testTargetLendingPool,
  testTargetLendingPoolRequiredSwaps,
} from './mocks/testSourcePosition'
import { mockRefinanceContext } from './mocks/contextMock'
import assert from 'assert'

describe('Refinance', () => {
  describe('to the position with the same collateral and debt (no swaps)', () => {
    let simulation: ISimulation<SimulationType.Refinance>
    beforeAll(async () => {
      simulation = await refinanceLendingToLendingSamePair(
        {
          position: testSourcePosition,
          targetPool: testTargetLendingPool,
          slippage: Percentage.createFrom({ value: 1 }),
        },
        mockRefinanceContext,
      )
    })

    it('should not include swap steps', async () => {
      const steps = simulation.steps.filter((step) => !step.skip).map((step) => step.type)

      expect(steps).not.toContain(SimulationSteps.Swap)
    })

    it('should open position with the same collateral', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.collateralAmount).toEqual(testSourcePosition.collateralAmount)
    })

    it('should open position with the same debt', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.debtAmount).toEqual(testSourcePosition.debtAmount)
    })

    it('should open position as required target pool', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.pool).toEqual(testTargetLendingPool)
      expect(targetPosition.positionId).toBeDefined()
    })

    it('should open position with id', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.positionId).toBeDefined()
    })

    it('should include a new position event step', async () => {
      const newPositionStep = simulation.steps.find(
        (step) => step.type === SimulationSteps.NewPositionEvent,
      ) as steps.NewPositionEvent

      assert(newPositionStep, 'New position event step not found')
      expect(newPositionStep.inputs.position).toEqual(simulation.targetPosition)
    })
  })

  describe.skip('to the position with the different collateral and debt (with swaps)', () => {
    let simulation: ISimulation<SimulationType.Refinance>
    beforeAll(async () => {
      simulation = await refinanceLendingToLendingAnyPair(
        {
          position: testSourcePosition,
          targetPool: testTargetLendingPoolRequiredSwaps,
          slippage: Percentage.createFrom({ value: 1 }),
        },
        mockRefinanceContext,
      )
    })

    it('should include two swap steps', async () => {
      const steps = simulation.steps.filter((step) => !step.skip).map((step) => step.type)

      expect(steps.length).toBe(2)
    })

    it('should open position with other collater', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.collateralAmount.token).toEqual(otherTestCollateral)
    })

    it('should open position with other debt', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.debtAmount).toEqual(otherTestDebt)
    })

    it('should open position as required target pool', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.pool).toEqual(testTargetLendingPoolRequiredSwaps)
    })

    it('should open position with id', async () => {
      const targetPosition = simulation.targetPosition

      expect(targetPosition.positionId).toBeDefined()
    })

    it('should open position with the same collateral amount', async () => {
      expect(mockRefinanceContext.swapManager.getSwapQuoteExactInput.mock.calls.length).toBe(2)
    })

    it('should exchange all collateral from source position ', async () => {
      expect(
        mockRefinanceContext.swapManager.getSwapQuoteExactInput.mock.calls[0][0].fromAmount,
      ).toEqual(testSourcePosition.collateralAmount)
    })
  })
})
