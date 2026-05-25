import {
  isAddressValue,
  isChainId,
  isHexData,
  isTokenAmount,
  type AddressValue,
  type ChainId,
  type HexData,
  type ITokenAmount,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const createAndSaveBuyOrder = publicProcedure
  .input(
    z.object({
      orderId: z.string(),
      userAddress: z.custom<AddressValue>(isAddressValue),
      chainId: z.custom<ChainId>(isChainId),
      fromVault: z.custom<AddressValue>(isAddressValue),
      toVault: z.custom<AddressValue>(isAddressValue),
      rebalanceAuthorizationSignature: z.custom<HexData>(isHexData),
      amountShares: z.custom<ITokenAmount>(isTokenAmount),
      slippagePercentage: z.string(),
      intervalSeconds: z.number().int().positive(),
      firstExecutionUnixTimestamp: z.number().int().positive(),
      deadlineUnixTimestamp: z.number().int().positive().optional(),
      maxTrades: z.number().int().positive(),
      neverBuyAbove: z.string().optional(),
      neverSellBelow: z.string().optional(),
      inAsset: z.custom<AddressValue>(isAddressValue),
      outAsset: z.custom<AddressValue>(isAddressValue),
      inAssetFeed: z.custom<AddressValue>(isAddressValue),
      outAssetFeed: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.createAndSaveBuyOrder(opts.input)
  })
