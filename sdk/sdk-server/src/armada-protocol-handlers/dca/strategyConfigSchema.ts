import {
  ArmadaDcaOrderStatusEnum,
  isAddressValue,
  type AddressValue,
  type ChainId,
  type HexData,
  type IArmadaDcaOrder,
  type IArmadaDcaStrategyConfig,
} from '@summerfi/sdk-common'
import { z } from 'zod'

const uint256StringSchema = z.string().regex(/^\d+$/)
const addressSchema = z.custom<AddressValue>(isAddressValue)
const hexDataSchema = z.string().regex(/^0x[0-9a-fA-F]*$/) as z.ZodType<HexData>

export const strategyIdSchema = uint256StringSchema

export const oracleAddressesSchema = z.object({
  inAssetFeed: addressSchema,
  outAssetFeed: addressSchema,
})

export const orderSchema: z.ZodType<IArmadaDcaOrder> = z.object({
  id: z.string().uuid(),
  orderId: uint256StringSchema,
  userAddress: addressSchema,
  chainId: z.number() as z.ZodType<ChainId>,
  fromVault: addressSchema,
  toVault: addressSchema,
  amount: uint256StringSchema,
  slippage: z.string(),
  intervalSeconds: z.number().int().positive(),
  nextExecutionAtUnixTimestamp: z.number().int(),
  deadlineUnixTimestamp: z.number().int().optional(),
  maxTrades: z.number().int().nonnegative(),
  tradesExecuted: z.number().int().nonnegative(),
  allowedVaultsRoot: hexDataSchema,
  fromVaultProof: z.array(hexDataSchema),
  toVaultProof: z.array(hexDataSchema),
  swapCalldata: hexDataSchema,
  signature: hexDataSchema,
  ensoRouterAddress: addressSchema,
  verifyingContractAddress: addressSchema,
  status: z.nativeEnum(ArmadaDcaOrderStatusEnum),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  cancelledAt: z.number().int().optional(),
  pausedAt: z.number().int().optional(),
  neverBuyAbove: z.string().optional(),
  neverSellBelow: z.string().optional(),
})

export const strategyConfigSchema: z.ZodType<IArmadaDcaStrategyConfig> = z.object({
  strategyId: uint256StringSchema,
  owner: addressSchema,
  sourceVault: addressSchema,
  targetVault: addressSchema,
  inAsset: addressSchema,
  outAsset: addressSchema,
  inAssetFeed: addressSchema,
  outAssetFeed: addressSchema,
  tradeAmount: uint256StringSchema,
  interval: uint256StringSchema,
  slippageBps: uint256StringSchema,
  maxPrice: uint256StringSchema,
  minPrice: uint256StringSchema,
  endDate: uint256StringSchema,
  maxTrades: uint256StringSchema,
})
