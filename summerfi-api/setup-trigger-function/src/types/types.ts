import { z } from 'zod'
import {
  aaveBasicBuyTriggerDataSchema,
  aaveBasicSellTriggerDataSchema,
  dmaAaveStopLossTriggerDataSchema,
  dmaAaveTrailingStopLossTriggerDataSchema,
  dmaSparkStopLossTriggerDataSchema,
  eventBodyAaveBasicBuySchema,
  eventBodyAaveBasicSellSchema,
  eventBodyDmaAaveStopLossSchema,
  eventBodyDmaAaveTrailingStopLossSchema,
  eventBodyDmaSparkStopLossSchema,
  eventBodySparkBasicBuySchema,
  eventBodySparkBasicSellSchema,
  eventBodyDmaSparkTrailingStopLossSchema,
  eventBodySparkPartialTakeProfitSchema,
  eventBodyAavePartialTakeProfitSchema,
  pathParamsSchema,
  dmaSparkTrailingStopLossTriggerDataSchema,
  sparkBasicBuyTriggerDataSchema,
  sparkBasicSellTriggerDataSchema,
  aavePartialTakeProfitTriggerDataSchema,
  sparkPartialTakeProfitTriggerDataSchema,
} from './validators'

export type AaveAutoBuyEventBody = z.infer<typeof eventBodyAaveBasicBuySchema>
export type AaveAutoSellEventBody = z.infer<typeof eventBodyAaveBasicSellSchema>
export type AaveStopLossEventBody = z.infer<typeof eventBodyDmaAaveStopLossSchema>
export type SparkAutoBuyEventBody = z.infer<typeof eventBodySparkBasicBuySchema>
export type SparkAutoSellEventBody = z.infer<typeof eventBodySparkBasicSellSchema>
export type SparkStopLossEventBody = z.infer<typeof eventBodyDmaSparkStopLossSchema>
export type AaveTrailingStopLossEventBody = z.infer<typeof eventBodyDmaAaveTrailingStopLossSchema>
export type SparkTrailingStopLossEventBody = z.infer<typeof eventBodyDmaSparkTrailingStopLossSchema>
export type AavePartialTakeProfitEventBody = z.infer<typeof eventBodyAavePartialTakeProfitSchema>
export type SparkPartialTakeProfitEventBody = z.infer<typeof eventBodySparkPartialTakeProfitSchema>
export type SetupTriggerEventBody =
  | AaveAutoBuyEventBody
  | AaveAutoSellEventBody
  | SparkAutoBuyEventBody
  | SparkAutoSellEventBody
  | AaveStopLossEventBody
  | SparkStopLossEventBody
  | AaveTrailingStopLossEventBody
  | SparkTrailingStopLossEventBody
  | AavePartialTakeProfitEventBody
  | SparkPartialTakeProfitEventBody

export type PathParams = z.infer<typeof pathParamsSchema>

export type AaveAutoBuyTriggerData = z.infer<typeof aaveBasicBuyTriggerDataSchema>
export type AaveAutoSellTriggerData = z.infer<typeof aaveBasicSellTriggerDataSchema>
export type DmaAaveStopLossTriggerData = z.infer<typeof dmaAaveStopLossTriggerDataSchema>
export type DmaAaveTrailingStopLossTriggerData = z.infer<
  typeof dmaAaveTrailingStopLossTriggerDataSchema
>

export type DmaSparkStopLossTriggerData = z.infer<typeof dmaSparkStopLossTriggerDataSchema>
export type DmaSparkTrailingStopLossTriggerData = z.infer<
  typeof dmaSparkTrailingStopLossTriggerDataSchema
>
export type SparkAutoBuyTriggerData = z.infer<typeof sparkBasicBuyTriggerDataSchema>
export type SparkAutoSellTriggerData = z.infer<typeof sparkBasicSellTriggerDataSchema>

export type AavePartialTakeProfitTriggerData = z.infer<
  typeof aavePartialTakeProfitTriggerDataSchema
>
export type SparkPartialTakeProfitTriggerData = z.infer<
  typeof sparkPartialTakeProfitTriggerDataSchema
>

export type TriggerData =
  | AaveAutoBuyTriggerData
  | AaveAutoSellTriggerData
  | DmaAaveStopLossTriggerData
  | DmaSparkStopLossTriggerData
  | DmaAaveTrailingStopLossTriggerData
  | DmaSparkTrailingStopLossTriggerData
  | SparkAutoBuyTriggerData
  | SparkAutoSellTriggerData
  | AavePartialTakeProfitTriggerData
  | SparkPartialTakeProfitTriggerData

export enum CommonErrorCodes {
  InsufficientEthFundsForTx = 'insufficient-eth-funds-for-tx',
  TriggerDoesNotExist = 'trigger-does-not-exist',
  TriggerAlreadyExists = 'trigger-already-exists',
}

export enum AutoBuyTriggerCustomErrorCodes {
  TooLowLtvToSetupAutoBuy = 'too-low-ltv-to-setup-auto-buy',
  ExecutionPriceBiggerThanMaxBuyPrice = 'execution-price-bigger-than-max-buy-price',
  ExecutionLTVSmallerThanTargetLTV = 'execution-ltv-smaller-than-target-ltv',
  ExecutionLTVBiggerThanCurrentLTV = 'execution-ltv-bigger-than-current-ltv',
  AutoBuyTriggerLowerThanAutoSellTarget = 'auto-buy-trigger-lower-than-auto-sell-target',
  MaxBuyPriceIsNotSet = 'max-buy-price-is-not-set',
  AutoBuyTriggerAlreadyExists = 'auto-buy-trigger-already-exists',
  AutoBuyTriggerDoesNotExist = 'auto-buy-trigger-does-not-exist',
  NetValueTooLowToSetupAutoBuy = 'net-value-too-low-to-setup-auto-buy',
  StopLossTriggerLowerThanAutoBuy = 'stop-loss-trigger-ltv-lower-than-auto-buy',

  // Error: Your Partial Take Profit min price is lower than the max price of your Auto-Buy. Increase your Partial Take Profit min price, or update your Auto-Buy
  PartialTakeProfitMinPriceLowerThanAutoBuyMaxPrice = 'partial-take-profit-min-price-lower-than-auto-buy-max-price',
}

export enum AutoBuyTriggerCustomWarningCodes {
  AutoBuyTriggeredImmediately = 'auto-buy-triggered-immediately',
  AutoBuyTargetCloseToAutoSellTrigger = 'auto-buy-target-close-to-auto-sell-trigger',
  AutoBuyTriggerCloseToStopLossTrigger = 'auto-buy-trigger-close-to-stop-loss-trigger',
  AutoBuyWithNoMaxPriceThreshold = 'auto-buy-with-no-max-price-threshold',
}

export enum AutoSellTriggerCustomErrorCodes {
  TooLowLtvToSetupAutoSell = 'too-low-ltv-to-setup-auto-sell',
  ExecutionPriceSmallerThanMinSellPrice = 'execution-price-smaller-than-min-sell-price',
  ExecutionLTVBiggerThanTargetLTV = 'execution-ltv-bigger-than-target-ltv',
  ExecutionLTVLowerThanCurrentLTV = 'execution-ltv-lower-than-current-ltv',
  AutoSellTriggerHigherThanAutoBuyTarget = 'auto-sell-trigger-higher-than-auto-buy-target',
  AutoSellNotAvailableDueToTooHighStopLoss = 'auto-sell-not-available-due-to-too-high-stop-loss',
  MinSellPriceIsNotSet = 'min-sell-price-is-not-set',
  AutoSellTriggerAlreadyExists = 'auto-sell-trigger-already-exists',
  AutoSellTriggerDoesNotExist = 'auto-sell-trigger-does-not-exist',
  NetValueTooLowToSetupAutoSell = 'net-value-too-low-to-setup-auto-sell',
  StopLossNeverTriggeredWithNoAutoSellMinSellPrice = 'stop-loss-never-triggered-with-no-auto-sell-min-sell-price',
  StopLossNeverTriggeredWithLowerAutoSellMinSellPrice = 'stop-loss-never-triggered-with-lower-auto-sell-min-sell-price',

  // Error: Your Partial Take Profit trigger LTV is higher than the target LTV of your Auto-Sell. Reduce your Partial Take Profit trigger, or update your Auto-Sell.
  PartialTakeProfitTriggerHigherThanAutoSellTarget = 'partial-take-profit-trigger-higher-than-auto-sell-target',

  // Error: Your Partial Take Profit target LTV is higher than the trigger LTV of your Auto-Sell. Reduce your Partial Take Profit target, or update your Auto-Sell.
  PartialTakeProfitTargetHigherThanAutoSellTrigger = 'partial-take-profit-target-higher-than-auto-sell-trigger',
}

export enum AutoSellTriggerCustomWarningCodes {
  AutoSellTriggeredImmediately = 'auto-sell-triggered-immediately',
  AutoSellTargetCloseToAutoBuyTrigger = 'auto-sell-target-close-to-auto-buy-trigger',
  AutoSellTriggerCloseToStopLossTrigger = 'auto-sell-trigger-close-to-stop-loss-trigger',
  AutoSellNeverTriggeredWithCurrentStopLoss = 'auto-sell-never-triggered-with-current-stop-loss',
  AutoSellWithNoMinPriceThreshold = 'auto-sell-with-no-min-price-threshold',
  NoMinSellPriceWhenStopLoss = 'no-min-sell-price-when-stop-loss-enabled',
}

export enum StopLossErrorCodes {
  StopLossTriggerAlreadyExists = 'stop-loss-trigger-already-exists',
  StopLossTriggerDoesNotExist = 'stop-loss-trigger-does-not-exist',
  DebtTooHighToSetupStopLoss = 'debt-too-high-to-setup-stop-loss',
  StopLossTriggeredByAutoBuy = 'stop-loss-triggered-by-auto-buy',
  StopLossNeverTriggeredWithNoAutoSellMinSellPrice = 'stop-loss-never-triggered-with-no-auto-sell-min-sell-price',
  StopLossNeverTriggeredWithLowerAutoSellMinSellPrice = 'stop-loss-never-triggered-with-lower-auto-sell-min-sell-price',

  // Error: Your Partial Take Profit target LTV is higher than your Stop-Loss. Reduce your Partial Take Profit target, or update your Stop-Loss.
  PartialTakeProfitTargetHigherThanStopLoss = 'partial-take-profit-target-higher-than-stop-loss',
}

export enum StopLossWarningCodes {
  StopLossTriggeredImmediately = 'stop-loss-triggered-immediately',
  StopLossMakesAutoSellNotTrigger = 'stop-loss-makes-auto-sell-not-trigger',
}

export enum PartialTakeProfitErrorCodes {
  // Error: Your Partial Take Profit trigger LTV is higher than the target LTV of your Auto-Sell. Reduce your Partial Take Profit trigger, or update your Auto-Sell.
  PartialTakeProfitTriggerHigherThanAutoSellTarget = 'partial-take-profit-trigger-higher-than-auto-sell-target',
  // Error: Your Partial Take Profit target LTV is higher than the trigger LTV of your Auto-Sell. Reduce your Partial Take Profit target, or update your Auto-Sell.
  PartialTakeProfitTargetHigherThanAutoSellTrigger = 'partial-take-profit-target-higher-than-auto-sell-trigger',
  // Error: Your Partial Take Profit target LTV is higher than your Stop-Loss. Reduce your Partial Take Profit target, or update your Stop-Loss.
  PartialTakeProfitTargetHigherThanStopLoss = 'partial-take-profit-target-higher-than-stop-loss',
  // Error: Your Partial Take Profit min price is lower than the max price of your Auto-Buy. Increase your Partial Take Profit min price, or update your Auto-Buy
  PartialTakeProfitMinPriceLowerThanAutoBuyMaxPrice = 'partial-take-profit-min-price-lower-than-auto-buy-max-price',
  ExecutionLTVBiggerThanCurrentLTV = 'execution-ltv-bigger-than-current-ltv',
}

export enum PartialTakeProfitWarningCodes {}

export enum TrailingStopLossErrorCodes {
  CantObtainLatestPrice = 'cant-obtain-latest-price',
}

export type ValidationIssue = { message: string; code: string; path: (string | number)[] }

export type ValidationResults = {
  success: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}
