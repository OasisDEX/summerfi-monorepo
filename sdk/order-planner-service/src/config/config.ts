import { SimulationSteps } from '@summerfi/sdk-common/orders'
import { ActionBuildersMap } from '@summerfi/order-planner-common/builders'
import {
  PullTokenActionBuilder,
  PaybackFlashloanActionBuilder,
  SwapActionBuilder,
  FlashloanActionBuilder,
} from '~orderplannerservice/builders'
import { DepositBorrowActionBuilder } from '~orderplannerservice/builders/DepositBorrowActionBuilder'
import { PaybackWithdrawActionBuilder } from '~orderplannerservice/builders/PaybackWithdrawActionBuilder'
import { ReturnFundsActionBuilder } from '~orderplannerservice/builders/ReturnFundsActionBuilder'

export const ActionBuildersConfig: ActionBuildersMap = {
  [SimulationSteps.PullToken]: PullTokenActionBuilder,
  [SimulationSteps.Flashloan]: FlashloanActionBuilder,
  [SimulationSteps.Swap]: SwapActionBuilder,
  [SimulationSteps.PaybackFlashloan]: PaybackFlashloanActionBuilder,
  [SimulationSteps.DepositBorrow]: DepositBorrowActionBuilder,
  [SimulationSteps.PaybackWithdraw]: PaybackWithdrawActionBuilder,
  [SimulationSteps.ReturnFunds]: ReturnFundsActionBuilder,
}
