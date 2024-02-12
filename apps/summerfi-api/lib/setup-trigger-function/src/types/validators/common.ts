import { z } from 'zod'
import { isBigInt, PRICE_DECIMALS } from '~types'
import { addressSchema, ChainId, ProtocolId } from '@summerfi/serverless-shared'

export const bigIntSchema = z
  .string()
  .refine((value) => isBigInt(value), {
    params: {
      code: 'not-bigint',
    },
    message: 'Must be a BigInt without decimals',
  })
  .transform((value) => BigInt(value))
  .or(z.bigint())

export const priceSchema = bigIntSchema.describe(`Price with ${PRICE_DECIMALS} decimals`)

export const maxGasFeeSchema = bigIntSchema.describe('Max gas fee in Gwei')

export const ltvSchema = bigIntSchema.refine((ltv) => ltv >= 0n && ltv < 10_000n, {
  params: {
    code: 'ltv-out-of-range',
  },
  message: 'LTV must be between 0 and 10_000',
})

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

export const positionTokensPricesSchema = z.object({
  collateralPrice: priceSchema,
  debtPrice: priceSchema,
})

export const positionSchema = z.object({
  collateral: tokenBalanceSchema,
  debt: tokenBalanceSchema,
  ltv: ltvSchema,
  address: addressSchema,
  prices: positionTokensPricesSchema,
  netValueUSD: priceSchema,
  hasStablecoinDebt: z.boolean().optional().default(true),
})

export enum SupportedTriggers {
  AutoBuy = 'auto-buy',
  AutoSell = 'auto-sell',
  DmaStopLoss = 'dma-stop-loss',
}

const supportedTriggersSchema = z.nativeEnum(SupportedTriggers)
const supportedChainSchema = z
  .string()
  .transform((id) => parseInt(id, 10))
  .refine((id) => Object.values(ChainId).includes(id), { message: 'Unsupported chain id' })

const supportedProtocolsSchema = z.nativeEnum(ProtocolId)

export const pathParamsSchema = z.object({
  trigger: supportedTriggersSchema,
  chainId: supportedChainSchema,
  protocol: supportedProtocolsSchema,
})
