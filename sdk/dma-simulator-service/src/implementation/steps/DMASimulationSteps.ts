import {
  IPercentage,
  IPrice,
  IToken,
  ITokenAmount,
  ProtocolName,
} from '@summerfi/sdk-common/common'
import { ILendingPool, ILendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { IExternalLendingPosition } from '@summerfi/sdk-common/orders'
import {
  FlashloanProvider,
  ReferenceableField,
  TokenTransferTargetType,
  ValueReference,
} from '@summerfi/sdk-common/simulation'
import { SwapProviderType, SwapRoute } from '@summerfi/sdk-common/swap'
import { Step } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../../enums/DMASimulatorStepsTypes'

export interface FlashloanStep
  extends Step<
    DMASimulatorStepsTypes.Flashloan,
    {
      amount: ITokenAmount
      provider: FlashloanProvider
    }
  > {}

export interface PullTokenStep
  extends Step<DMASimulatorStepsTypes.PullToken, { amount: ReferenceableField<ITokenAmount> }> {}

export interface DepositBorrowStep
  extends Step<
    DMASimulatorStepsTypes.DepositBorrow,
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
    DMASimulatorStepsTypes.PaybackWithdraw,
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
    DMASimulatorStepsTypes.Skipped,
    {
      type: DMASimulatorStepsTypes
      protocol?: ProtocolName
    }
  > {}

export interface SwapStep
  extends Step<
    DMASimulatorStepsTypes.Swap,
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

export interface ReturnFundsStep
  extends Step<DMASimulatorStepsTypes.ReturnFunds, { token: IToken }> {}

export interface RepayFlashloanStep
  extends Step<
    DMASimulatorStepsTypes.RepayFlashloan,
    {
      amount: ITokenAmount
    }
  > {}

export interface NewPositionEventStep
  extends Step<
    DMASimulatorStepsTypes.NewPositionEvent,
    {
      position: ILendingPosition
    }
  > {}

export interface ImportStep
  extends Step<DMASimulatorStepsTypes.Import, { externalPosition: IExternalLendingPosition }> {}

export interface OpenPosition
  extends Step<
    DMASimulatorStepsTypes.OpenPosition,
    { pool: ILendingPool },
    { position: ILendingPosition }
  > {}

export type DMASimulatorSteps =
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
