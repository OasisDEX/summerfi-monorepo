import { z } from 'zod'
import { PRICE_DECIMALS } from './constants'
import {
  addressSchema,
  bigIntSchema,
  ChainId,
  LTV,
  ltvSchema,
  ProtocolId,
} from '@summerfi/serverless-shared'

export const priceSchema = bigIntSchema.describe(`Price with ${PRICE_DECIMALS} decimals`)

export const maxGasFeeSchema = bigIntSchema.describe('Max gas fee in Gwei')

export enum SupportedActions {
  Add = 'add',
  Remove = 'remove',
  Update = 'update',
}

export const supportedActionsSchema = z
  .nativeEnum(SupportedActions)
  .optional()
  .default(SupportedActions.Add)

export const tokenSchema = z.object({
  address: addressSchema,
  symbol: z.string(),
  decimals: z.number().gt(0),
})

export const tokenBalanceSchema = z.object({
  token: tokenSchema,
  balance: bigIntSchema,
})

export const positionAddressesSchema = z.object({
  collateral: addressSchema,
  debt: addressSchema,
})

export const poolIdSchema = z.string().startsWith('0x')

export const positionTokensPricesSchema = z.object({
  collateralPrice: priceSchema,
  debtPrice: priceSchema,
})

export const positionSchema = z.object({
  collateral: tokenBalanceSchema,
  debt: tokenBalanceSchema,
  ltv: ltvSchema,
  address: addressSchema,
  oraclePrices: positionTokensPricesSchema,
  collateralPriceInDebt: priceSchema,
  netValueUSD: priceSchema,
  debtValueUSD: priceSchema,
  collateralValueUSD: priceSchema,
  hasStablecoinDebt: z.boolean().optional().default(true),
})

export enum SupportedTriggers {
  AutoBuy = 'auto-buy',
  AutoSell = 'auto-sell',
  DmaStopLoss = 'dma-stop-loss',
  DmaTrailingStopLoss = 'dma-trailing-stop-loss',
  DmaPartialTakeProfit = 'dma-partial-take-profit',
}

export const supportedTriggersSchema = z.nativeEnum(SupportedTriggers)
export const supportedChainSchema = z
  .string()
  .transform((id) => parseInt(id, 10))
  .refine((id) => Object.values(ChainId).includes(id), { message: 'Unsupported chain id' })

export const supportedProtocolsSchema = z.nativeEnum(ProtocolId)

export type PositionLike = z.infer<typeof positionSchema>
export type Token = z.infer<typeof tokenSchema>
export type TokenBalance = z.infer<typeof tokenBalanceSchema>
export type Price = z.infer<typeof priceSchema>

export type CurrentTriggerLike = {
  id: bigint
  triggerData: `0x${string}`
  triggersOnAccount: number
}

export interface CurrentStopLoss extends CurrentTriggerLike {
  executionPrice: Price
  executionLTV: LTV
}
