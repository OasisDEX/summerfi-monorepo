import { SimulationSteps } from '@summerfi/sdk-common'
import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import {
  DepositBorrowActionBuilder,
  FlashloanActionBuilder,
  ImportPositionActionBuilder,
  PaybackWithdrawActionBuilder,
  PositionCreatedActionBuilder,
  PullTokenActionBuilder,
  RepayFlashloanActionBuilder,
  ReturnFundsActionBuilder,
  SwapActionBuilder,
  OpenPositionActionBuilder,
  SkippedStepActionBuilder,
} from '@summerfi/protocol-plugins'

export const ActionBuildersConfig: ActionBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.RepayFlashloan]: RepayFlashloanActionBuilder,
  [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilder,
  [SimulationSteps.ReturnFunds]: ReturnFundsActionBuilder,
  [SimulationSteps.NewPositionEvent]: PositionCreatedActionBuilder,
  [SimulationSteps.Import]: ImportPositionActionBuilder,
  [SimulationSteps.OpenPosition]: OpenPositionActionBuilder,
  [SimulationSteps.Skipped]: SkippedStepActionBuilder,
}
