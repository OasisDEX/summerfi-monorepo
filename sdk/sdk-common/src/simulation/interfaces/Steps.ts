import { SwapProviderType } from '../../swap/enums/SwapProviderType'
import { ProtocolName } from '../../common/enums/ProtocolName'
import { IPercentage } from '../../common/interfaces/IPercentage'
import { IPrice } from '../../common/interfaces/IPrice'
import { IToken } from '../../common/interfaces/IToken'
import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import { ILendingPool } from '../../lending-protocols/interfaces/ILendingPool'
import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { IExternalLendingPosition } from '../../orders/importing/interfaces/IExternalLendingPosition'

import { FlashloanProvider } from '../enums/FlashloanProvider'
import { SimulationSteps } from '../enums/SimulationSteps'
import { TokenTransferTargetType } from '../enums/TokenTransferTargetType'
import { ReferenceableField, ValueReference } from './ValueReference'
import { SwapRoute } from '../../swap/implementation/QuoteData'

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
      amount: ITokenAmount
      provider: FlashloanProvider
    }
  > {}

export interface PullTokenStep
  extends Step<SimulationSteps.PullToken, { amount: ReferenceableField<ITokenAmount> }> {}

export interface DepositBorrowStep
  extends Step<
    SimulationSteps.DepositBorrow,
    {
      depositAmount: ReferenceableField<ITokenAmount>
      borrowAmount: ReferenceableField<ITokenAmount>
      position: ILendingPosition
      additionalDeposit?: ValueReference<ITokenAmount>
      borrowTargetType: TokenTransferTargetType
    },
    {
      depositAmount: ITokenAmount
      borrowAmount: ITokenAmount
    }
  > {}

export interface PaybackWithdrawStep
  extends Step<
    SimulationSteps.PaybackWithdraw,
    {
      paybackAmount: ReferenceableField<ITokenAmount>
      withdrawAmount: ITokenAmount
      position: ILendingPosition
      withdrawTargetType: TokenTransferTargetType
    },
    {
      paybackAmount: ITokenAmount
      withdrawAmount: ITokenAmount
    }
  > {}

export interface SkippedStep
  extends Step<
    SimulationSteps.Skipped,
    {
      type: SimulationSteps
      protocol?: ProtocolName
    }
  > {}

export interface SwapStep
  extends Step<
    SimulationSteps.Swap,
    {
      provider: SwapProviderType
      routes: SwapRoute[]
      /** Spot price of the token being traded */
      spotPrice: IPrice
      /** Offer price of the token being traded, derived from the swap quote */
      offerPrice: IPrice
      /** Full amount sent to the swap contract, before deducting the Summer fee */
      inputAmount: ITokenAmount
      /** Amount to be swapped after deducting the Summer fee */
      inputAmountAfterFee: ITokenAmount
      /** Amount estimated by the swap service to be received, equal to `inputAmountAfterFee / offerPrice` */
      estimatedReceivedAmount: ITokenAmount
      /** Minimum amount to be received from the swap service, equal to `inputAmountAfterFee / offerPrice * (1 - slippage)` */
      minimumReceivedAmount: ITokenAmount
      /** Maximum slippage accepted for the swap */
      slippage: IPercentage
      /** Fee charged by Summer */
      summerFee: IPercentage
    },
    {
      /** Effective amount received after the actual swap */
      received: ITokenAmount
    }
  > {}

export interface ReturnFundsStep extends Step<SimulationSteps.ReturnFunds, { token: IToken }> {}

export interface RepayFlashloanStep
  extends Step<
    SimulationSteps.RepayFlashloan,
    {
      amount: ITokenAmount
    }
  > {}

export interface NewPositionEventStep
  extends Step<
    SimulationSteps.NewPositionEvent,
    {
      position: ILendingPosition
    }
  > {}

export interface ImportStep
  extends Step<SimulationSteps.Import, { externalPosition: IExternalLendingPosition }> {}

export interface OpenPosition
  extends Step<
    SimulationSteps.OpenPosition,
    { pool: ILendingPool },
    { position: ILendingPosition }
  > {}

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
  | SkippedStep
