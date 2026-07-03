import {
  DcaStrategyStatusEnum,
  isAddressValue,
  isChainId,
  type AddressValue,
  type ChainId,
  type IDcaStrategy,
} from '@summerfi/sdk-common'
import { z } from 'zod'

const uint256StringSchema = z.string().regex(/^\d+$/)
const addressSchema = z.custom<AddressValue>(isAddressValue)
const nonZeroAddressSchema = addressSchema.refine(
  (v) => v !== '0x0000000000000000000000000000000000000000',
  'Address must not be the zero address',
)

const chainlinkFeedSchema = z.object({
  feed: nonZeroAddressSchema,
  // maxStaleness in seconds; 0 = contract default (24h). Non-negative integer string-or-bigint.
  maxStaleness: z.bigint().nonnegative(),
})

const MIN_INTERVAL_SECONDS = 86400 // 1 day, matching _MIN_INTERVAL in DCAStrategyManager
const MAX_SLIPPAGE_PERCENTAGE = 100 // 100% = 10000 bps, matching _BPS in DCAStrategyManager

export const strategyIdSchema = uint256StringSchema

// Fields shared by createStrategy (no deposit) and depositAndCreate (with deposit).
const strategyTxBaseShape = {
  chainId: z.custom<ChainId>(isChainId),
  userAddress: addressSchema,
  fromVault: addressSchema,
  toVault: addressSchema,
  inAsset: addressSchema,
  outAsset: addressSchema,
  inAssetFeed: chainlinkFeedSchema,
  outAssetFeed: chainlinkFeedSchema,
  amountShares: uint256StringSchema.refine((v) => v !== '0', 'Trade amount must not be zero'),
  slippagePercentage: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= MAX_SLIPPAGE_PERCENTAGE,
      `Slippage percentage must be between 0 and ${MAX_SLIPPAGE_PERCENTAGE}`,
    ),
  intervalSeconds: z
    .number()
    .int()
    .min(MIN_INTERVAL_SECONDS, `Interval must be at least ${MIN_INTERVAL_SECONDS} seconds (1 day)`),
  maxTrades: z.number().int().positive(),
  neverBuyAbove: z.string().optional(),
  neverSellBelow: z.string().optional(),
  deadlineUnixTimestamp: z.number().int(),
}

/** Input for `createStrategyTx` — registers a strategy with no initial deposit. */
export const createStrategyTxInputSchema = z.object(strategyTxBaseShape)

/** Input for `depositAndCreateStrategyTx` — creates a strategy and makes the initial deposit. */
export const depositAndCreateStrategyTxInputSchema = z.object({
  ...strategyTxBaseShape,
  assetAmount: uint256StringSchema.refine((v) => v !== '0', 'Deposit amount must not be zero'),
})

export const strategySchema: z.ZodType<IDcaStrategy> = z.object({
  id: z.string(),
  strategyId: z.bigint(),
  chainId: z.custom<ChainId>(isChainId),
  ownerAddress: addressSchema,
  sourceVault: addressSchema,
  targetVault: addressSchema,
  inAsset: addressSchema,
  outAsset: addressSchema,
  inAssetFeed: chainlinkFeedSchema,
  outAssetFeed: chainlinkFeedSchema,
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
  createdAtUnixTimestamp: z.bigint(),
  updatedAtUnixTimestamp: z.bigint(),
})

/**
 * The subset of strategy fields an edit may change (mirrors `IDcaStrategyUpdate`). The SDK merges
 * this over the current strategy to build the on-chain `newConfig`; owner and all read-only/derived
 * fields are intentionally omitted.
 */
export const strategyUpdateSchema = z
  .object({
    sourceVault: addressSchema,
    targetVault: addressSchema,
    inAsset: addressSchema,
    outAsset: addressSchema,
    inAssetFeed: chainlinkFeedSchema,
    outAssetFeed: chainlinkFeedSchema,
    tradeAmount: z.bigint(),
    slippagePercentage: z.number(),
    intervalSeconds: z.bigint(),
    deadlineUnixTimestamp: z.bigint(),
    maxTrades: z.bigint(),
    neverBuyAbove: z.string(),
    neverSellBelow: z.string(),
  })
  .partial()

export const editStrategyTxInputSchema = z
  .object({
    chainId: z.custom<ChainId>(isChainId),
    strategy: strategySchema,
    update: strategyUpdateSchema,
  })
  // Validate the merged result — i.e. the on-chain `newConfig` the edit will commit — rather than
  // the (already-valid) current strategy on its own.
  .superRefine(({ strategy, update }, ctx) => {
    const merged = { ...strategy, ...update }
    if (merged.intervalSeconds < BigInt(MIN_INTERVAL_SECONDS)) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: MIN_INTERVAL_SECONDS,
        type: 'bigint',
        inclusive: true,
        message: `Interval must be at least ${MIN_INTERVAL_SECONDS} seconds (1 day)`,
        path: ['update', 'intervalSeconds'],
      })
    }
    if (merged.slippagePercentage > MAX_SLIPPAGE_PERCENTAGE) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: MAX_SLIPPAGE_PERCENTAGE,
        type: 'number',
        inclusive: true,
        message: `Slippage percentage must be between 0 and ${MAX_SLIPPAGE_PERCENTAGE}`,
        path: ['update', 'slippagePercentage'],
      })
    }
    if (merged.tradeAmount === BigInt(0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Trade amount must not be zero',
        path: ['update', 'tradeAmount'],
      })
    }
    if (merged.inAssetFeed.feed === '0x0000000000000000000000000000000000000000') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'inAssetFeed.feed must not be the zero address',
        path: ['update', 'inAssetFeed', 'feed'],
      })
    }
    if (merged.outAssetFeed.feed === '0x0000000000000000000000000000000000000000') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'outAssetFeed.feed must not be the zero address',
        path: ['update', 'outAssetFeed', 'feed'],
      })
    }
  })
