import { z } from 'zod'
import {
  aaveBasicBuyTriggerDataSchema,
  aaveBasicSellTriggerDataSchema,
  dmaStopLossTriggerDataSchema,
  eventBodyAaveBasicBuySchema,
  eventBodyAaveBasicSellSchema,
  eventBodyDmaStopLossSchema,
  ltvSchema,
  pathParamsSchema,
  positionSchema,
  priceSchema,
  tokenBalanceSchema,
  tokenSchema,
} from './validators'

export type AutoBuyEventBody = z.infer<typeof eventBodyAaveBasicBuySchema>
export type AutoSellEventBody = z.infer<typeof eventBodyAaveBasicSellSchema>
export type StopLossEventBody = z.infer<typeof eventBodyDmaStopLossSchema>
export type SetupTriggerEventBody = AutoBuyEventBody | AutoSellEventBody | StopLossEventBody
export type PathParams = z.infer<typeof pathParamsSchema>
export type PositionLike = z.infer<typeof positionSchema>
export type Token = z.infer<typeof tokenSchema>
export type TokenBalance = z.infer<typeof tokenBalanceSchema>
export type Price = z.infer<typeof priceSchema>
export type LTV = z.infer<typeof ltvSchema>
export type AaveAutoBuyTriggerData = z.infer<typeof aaveBasicBuyTriggerDataSchema>
export type AaveAutoSellTriggerData = z.infer<typeof aaveBasicSellTriggerDataSchema>
export type DmaStopLossTriggerData = z.infer<typeof dmaStopLossTriggerDataSchema>
export type TriggerData = AaveAutoBuyTriggerData | AaveAutoSellTriggerData | DmaStopLossTriggerData

export enum CommonErrorCodes {
  InsufficientEthFundsForTx = 'insufficient-eth-funds-for-tx',
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
}

export enum AutoSellTriggerCustomWarningCodes {
  AutoSellTriggeredImmediately = 'auto-sell-triggered-immediately',
  AutoSellTargetCloseToAutoBuyTrigger = 'auto-sell-target-close-to-auto-buy-trigger',
  AutoSellTriggerCloseToStopLossTrigger = 'auto-sell-trigger-close-to-stop-loss-trigger',
  AutoSellWithNoMinPriceThreshold = 'auto-sell-with-no-min-price-threshold',
  NoMinSellPriceWhenStopLoss = 'no-min-sell-price-when-stop-loss-enabled',
}

export enum StopLossErrorCodes {
  StopLossTriggeredImmediately = 'stop-loss-triggered-immediately',
}

export type ValidationIssue = { message: string; code: string; path: (string | number)[] }

export type ValidationResults = {
  success: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}
