import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { ActionBuilder, ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import {
  DepositBorrowActionBuilder,
  FlashloanActionBuilder,
  PaybackWithdrawActionBuilder,
  PositionCreatedActionBuilder,
  PullTokenActionBuilder,
  RepayFlashloanActionBuilder,
  ReturnFundsActionBuilder,
  SwapActionBuilder,
} from '@summerfi/protocol-plugins/plugins/common'

const ActionBuilderNotImplemented: ActionBuilder<steps.ImportStep> = () => {
  throw new Error('Action builder Import not implemented')
}

export const ActionBuildersConfig: ActionBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.RepayFlashloan]: RepayFlashloanActionBuilder,
  [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilder,
  [SimulationSteps.ReturnFunds]: ReturnFundsActionBuilder,
  [SimulationSteps.NewPositionEvent]: PositionCreatedActionBuilder,
  [SimulationSteps.Import]: ActionBuilderNotImplemented,
}
