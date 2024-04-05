import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
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

export const ActionBuildersConfig: ActionBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.RepayFlashloan]: RepayFlashloanActionBuilder,
  [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilder,
  [SimulationSteps.ReturnFunds]: ReturnFundsActionBuilder,
  [SimulationSteps.NewPositionEvent]: PositionCreatedActionBuilder,
}
