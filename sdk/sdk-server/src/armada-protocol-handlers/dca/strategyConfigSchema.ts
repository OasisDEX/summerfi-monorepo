import {
  isAddressValue,
  type AddressValue,
  type IArmadaDcaStrategyConfig,
} from '@summerfi/sdk-common'
import { z } from 'zod'

const uint256StringSchema = z.string().regex(/^\d+$/)

export const strategyIdSchema = uint256StringSchema

export const strategyConfigSchema: z.ZodType<IArmadaDcaStrategyConfig> = z.object({
  strategyId: uint256StringSchema,
  owner: z.custom<AddressValue>(isAddressValue),
  sourceVault: z.custom<AddressValue>(isAddressValue),
  targetVault: z.custom<AddressValue>(isAddressValue),
  inAsset: z.custom<AddressValue>(isAddressValue),
  outAsset: z.custom<AddressValue>(isAddressValue),
  inAssetFeed: z.custom<AddressValue>(isAddressValue),
  outAssetFeed: z.custom<AddressValue>(isAddressValue),
  tradeAmount: uint256StringSchema,
  interval: uint256StringSchema,
  slippageBps: uint256StringSchema,
  maxPrice: uint256StringSchema,
  minPrice: uint256StringSchema,
  endDate: uint256StringSchema,
  maxTrades: uint256StringSchema,
})
