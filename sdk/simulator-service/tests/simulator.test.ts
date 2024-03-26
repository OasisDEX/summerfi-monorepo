import { Percentage } from '@summerfi/sdk-common/common'
import { ISimulation, SimulationSteps, SimulationType } from '@summerfi/sdk-common/simulation'
import { refinance } from '../src/strategies'
import {
  otherTestCollateral,
  otherTestDebt,
  testSourcePosition,
  testTargetLendingPool,
  testTargetLendingPoolRequiredSwaps,
} from './mocks/testSourcePosition'
import { mockRefinanceContext } from './mocks/contextMock'

describe('Refinance', () => {
  describe('to the position with the same collateral and debt (no swaps)', () => {
    let simulation: ISimulation<SimulationType.Refinance>
    beforeAll(async () => {
      simulation = await refinance(
        {
          position: testSourcePosition,
          targetPool: testTargetLendingPool,
          targetDebt:
            testTargetLendingPool.debts[testSourcePosition.debtAmount.token.address.value].token
              .address,
          targetCollateral:
            testTargetLendingPool.collaterals[
              testSourcePosition.collateralAmount.token.address.value
            ].token.address,
          slippage: Percentage.createFrom({ percentage: 1 }),
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
      console.log(targetPosition.positionId)
    })
  })

  describe.only('to the position with the different collateral and debt (with swaps)', () => {
    let simulation: ISimulation<SimulationType.Refinance>
    beforeAll(async () => {
      // Swapped the tokens around to force two swaps
      console.log("targetDebt", testTargetLendingPoolRequiredSwaps.debts[testSourcePosition.collateralAmount.token.address.value].token.address)
      console.log("targetColl", testTargetLendingPoolRequiredSwaps.collaterals[testSourcePosition.debtAmount.token.address.value].token.address)
      simulation = await refinance(
        {
          position: testSourcePosition,
          targetPool: testTargetLendingPoolRequiredSwaps,
          targetDebt:
            testTargetLendingPoolRequiredSwaps.debts[testSourcePosition.collateralAmount.token.address.value].token.address,
          targetCollateral:
            testTargetLendingPoolRequiredSwaps.collaterals[testSourcePosition.debtAmount.token.address.value].token.address,
          slippage: Percentage.createFrom({ percentage: 1 }),
        },
        mockRefinanceContext,
      )
    })

    it.only('should include two swap steps', async () => {
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
