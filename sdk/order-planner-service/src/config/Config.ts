import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'
import {
  DepositBorrowActionBuilder,
  FlashloanActionBuilder,
  PaybackWithdrawActionBuilder,
  PullTokenActionBuilder,
  RepayFlashloanActionBuilder,
  ReturnFundsActionBuilder,
  SwapActionBuilder,
} from '@summerfi/protocol-plugins'

export const ActionBuildersConfig: ActionBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.RepayFlashloan]: RepayFlashloanActionBuilder,
  [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilder,
  [SimulationSteps.ReturnFunds]: ReturnFundsActionBuilder,
}
