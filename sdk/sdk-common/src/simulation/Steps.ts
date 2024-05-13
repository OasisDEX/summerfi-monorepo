import { Percentage } from '../common/implementation/Percentage'
import { Price } from '../common/implementation/Price'
import { Position } from '../common/implementation/Position'
import { Token } from '../common/implementation/Token'
import { TokenAmount } from '../common/implementation/TokenAmount'
import { FlashloanProvider, SimulationSteps, TokenTransferTargetType } from './Enums'
import { SwapProviderType, SwapRoute } from '../swap'
import { ReferenceableField, ValueReference } from './ValueReference'
import { IExternalPosition } from '../orders/interfaces/importing/IExternalPosition'
import { ILendingPool } from '../protocols/interfaces/ILendingPool'

export interface Step<T extends SimulationSteps, I, O = undefined> {
  type: T
  name: string
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
      withdrawTargetType: TokenTransferTargetType
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
      /** Spot price of the token being traded */
      spotPrice: Price
      /** Offer price of the token being traded, derived from the swap quote */
      offerPrice: Price
      /** Full amount sent to the swap contract, before deducting the Summer fee */
      inputAmount: TokenAmount
      /** Amount to be swapped after deducting the Summer fee */
      inputAmountAfterFee: TokenAmount
      /** Amount estimated by the swap service to be received, equal to `inputAmountAfterFee / offerPrice` */
      estimatedReceivedAmount: TokenAmount
      /** Minimum amount to be received from the swap service, equal to `inputAmountAfterFee / offerPrice * (1 - slippage)` */
      minimumReceivedAmount: TokenAmount
      /** Maximum slippage accepted for the swap */
      slippage: Percentage
      /** Fee charged by Summer */
      summerFee: Percentage
    },
    {
      /** Effective amount received after the actual swap */
      received: TokenAmount
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

export interface OpenPosition extends Step<SimulationSteps.OpenPosition, { pool: ILendingPool }, { position: Position }> {}

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
  | OpenPosition
