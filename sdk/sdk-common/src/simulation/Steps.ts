import { Percentage } from '../common/implementation/Percentage'
import { Position } from '../common/implementation/Position'
import { Token } from '../common/implementation/Token'
import { TokenAmount } from '../common/implementation/TokenAmount'
import { FlashloanProvider, SimulationSteps } from './Enums'
import { ReferenceableField, ValueReference } from './ValueReference'

export interface Step<T extends SimulationSteps, I, O = undefined, N extends string = string> {
  type: T
  name: N
  inputs: I
  outputs: O
  skip?: boolean
}

export interface FlashloanStep
  extends Step<
    SimulationSteps.Flashloan,
    {
      amount: TokenAmount
      provider: FlashloanProvider
    }
  > {}

export interface PullTokenStep
  extends Step<SimulationSteps.PullToken, { amount: ReferenceableField<TokenAmount> }> {}

export interface DepositBorrowStep
  extends Step<
    SimulationSteps.DepositBorrow,
    {
      depositAmount: ReferenceableField<TokenAmount>
      borrowAmount: ReferenceableField<TokenAmount>
      position: Position
      additionalDeposit?: ValueReference<TokenAmount>
    },
    {
      depositAmount: TokenAmount
      borrowAmount: TokenAmount
    }
  > {}

export interface PaybackWithdrawStep
  extends Step<
    SimulationSteps.PaybackWithdraw,
    {
      paybackAmount: ReferenceableField<TokenAmount>
      withdrawAmount: ReferenceableField<TokenAmount>
      position: Position
    },
    {
      paybackAmount: TokenAmount
      withdrawAmount: TokenAmount
    }
  > {}

export interface SwapStep
  extends Step<
    SimulationSteps.Swap,
    {
      fromTokenAmount: TokenAmount
      toTokenAmount: TokenAmount
      slippage: Percentage
      fee: Percentage
    },
    {
      receivedAmount: TokenAmount
    }
  > {}

export interface ReturnFunds extends Step<SimulationSteps.ReturnFunds, { token: Token }> {}

export interface RepayFlashloan
  extends Step<
    SimulationSteps.RepayFlashloan,
    {
      amount: TokenAmount
    }
  > {}

export type Steps =
  | FlashloanStep
  | PullTokenStep
  | DepositBorrowStep
  | PaybackWithdrawStep
  | SwapStep
  | ReturnFunds
  | RepayFlashloan
