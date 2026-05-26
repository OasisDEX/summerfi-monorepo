import {
  DcaStrategyStatusEnum,
  isAddressValue,
  type AddressValue,
  type ChainId,
  type IDcaStrategy,
} from '@summerfi/sdk-common'
import { z } from 'zod'

const uint256StringSchema = z.string().regex(/^\d+$/)
const addressSchema = z.custom<AddressValue>(isAddressValue)

export const strategyIdSchema = uint256StringSchema

export const createStrategyTxInputSchema = z.object({
  chainId: z.number() as z.ZodType<ChainId>,
  userAddress: addressSchema,
  fromVault: addressSchema,
  toVault: addressSchema,
  inAsset: addressSchema,
  outAsset: addressSchema,
  inAssetFeed: addressSchema,
  outAssetFeed: addressSchema,
  amountShares: uint256StringSchema,
  slippagePercentage: z.string(),
  intervalSeconds: z.number().int().positive(),
  maxTrades: z.number().int().positive(),
  neverBuyAbove: z.string().optional(),
  neverSellBelow: z.string().optional(),
  deadlineUnixTimestamp: z.number().int(),
})

export const strategySchema: z.ZodType<IDcaStrategy> = z.object({
  id: z.string(),
  strategyId: z.bigint(),
  chainId: z.number() as z.ZodType<ChainId>,
  ownerAddress: addressSchema,
  sourceVault: addressSchema,
  targetVault: addressSchema,
  inAsset: addressSchema,
  outAsset: addressSchema,
  inAssetFeed: addressSchema,
  outAssetFeed: addressSchema,
  tradeAmount: z.bigint(),
  slippagePercentage: z.number(),
  intervalSeconds: z.bigint(),
  nextTriggerAtUnixTimestamp: z.bigint(),
  lastScheduledAtUnixTimestamp: z.bigint(),
  deadlineUnixTimestamp: z.bigint(),
  maxTrades: z.bigint(),
  status: z.nativeEnum(DcaStrategyStatusEnum),
  tradesExecuted: z.bigint(),
  neverBuyAbove: z.string(),
  neverSellBelow: z.string(),
  createdAt: z.bigint(),
  updatedAt: z.bigint(),
})
