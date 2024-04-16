import { Percentage } from '../common/implementation/Percentage'
import { Price } from '../common/implementation/Price'
import { Position } from '../common/implementation/Position'
import { Token } from '../common/implementation/Token'
import { TokenAmount } from '../common/implementation/TokenAmount'
import { FlashloanProvider, SimulationSteps, TokenTransferTargetType } from './Enums'
import { SwapProviderType, SwapRoute } from '../swap'
import { ReferenceableField, ValueReference } from './ValueReference'
import { IExternalPosition } from '../orders/interfaces/importing/IExternalPosition'

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
      borrowTargetType: TokenTransferTargetType
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
      withdrawAmount: TokenAmount
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
      provider: SwapProviderType
      routes: SwapRoute[]
      spotPrice: Price
      fromTokenAmount: TokenAmount
      toTokenAmount: TokenAmount
      slippage: Percentage
      summerFee: Percentage
    },
    {
      receivedAmount: TokenAmount
    }
  > {}

export interface ReturnFundsStep extends Step<SimulationSteps.ReturnFunds, { token: Token }> {}

export interface RepayFlashloanStep
  extends Step<
    SimulationSteps.RepayFlashloan,
    {
      amount: TokenAmount
    }
  > {}

export interface NewPositionEventStep
  extends Step<
    SimulationSteps.NewPositionEvent,
    {
      position: Position
    }
  > {}

export interface ImportStep
  extends Step<SimulationSteps.Import, { externalPosition: IExternalPosition }> {}

export type Steps =
  | FlashloanStep
  | PullTokenStep
  | DepositBorrowStep
  | PaybackWithdrawStep
  | SwapStep
  | ReturnFundsStep
  | RepayFlashloanStep
  | NewPositionEventStep
  | ImportStep
