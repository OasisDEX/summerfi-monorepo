import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { PullTokenActionBuilder } from '../builders/PullTokenActionBuilder'
import { FlashloanActionBuilder } from '../builders/FlashloanActionBuilder'
import { SwapActionBuilder } from '../builders/SwapActionBuilder'
import { RepayFlashloanActionBuilder } from '../builders/RepayFlashloanActionBuilder'
import { DepositBorrowActionBuilder } from '../builders/DepositBorrowActionBuilder'
import { PaybackWithdrawActionBuilder } from '../builders/PaybackWithdrawActionBuilder'
import { ReturnFundsActionBuilder } from '../builders/ReturnFundsActionBuilder'
import { ActionBuildersMap } from '@summerfi/protocol-plugins-common'

export const ActionBuildersConfig: ActionBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.RepayFlashloan]: RepayFlashloanActionBuilder,
  [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilder,
  [SimulationSteps.ReturnFunds]: ReturnFundsActionBuilder,
}
