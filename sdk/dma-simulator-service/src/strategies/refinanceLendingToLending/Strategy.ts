import { makeStrategy } from '@summerfi/simulator-common/utils'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'

export const refinanceLendingToLendingAnyPairStrategy = makeStrategy([
  {
    name: 'Flashloan',
    step: DMASimulatorStepsTypes.Flashloan,
    optional: true,
  },
  {
    name: 'PaybackWithdrawFromSourcePosition',
    step: DMASimulatorStepsTypes.PaybackWithdraw,
    optional: false,
  },
  {
    name: 'SwapCollateralFromSourcePosition',
    step: DMASimulatorStepsTypes.Swap,
    optional: true,
  },
  {
    name: 'OpenTargetPosition',
    step: DMASimulatorStepsTypes.OpenPosition,
    optional: false,
  },
  {
    name: 'DepositBorrowToTargetPosition',
    step: DMASimulatorStepsTypes.DepositBorrow,
    optional: false,
  },
  {
    name: 'SwapDebtFromTargetPosition',
    step: DMASimulatorStepsTypes.Swap,
    optional: true,
  },
  {
    name: 'RepayFlashloan',
    step: DMASimulatorStepsTypes.RepayFlashloan,
    optional: true,
  },
  {
    name: 'ReturnFunds',
    step: DMASimulatorStepsTypes.ReturnFunds,
    optional: true,
  },
  {
    name: 'NewPositionEvent',
    step: DMASimulatorStepsTypes.NewPositionEvent,
    optional: false,
  },
] as const)
