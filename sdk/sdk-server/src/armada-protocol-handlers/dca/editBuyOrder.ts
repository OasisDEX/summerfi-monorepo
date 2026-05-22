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
import { publicProcedure, verifyEarnBearerToken } from '../../SDKTRPC'

export const editBuyOrder = publicProcedure
  .input(
    z.object({
      id: z.string(),
      orderId: z.string(),
      userAddress: z.custom<AddressValue>(isAddressValue),
      chainId: z.custom<ChainId>(isChainId),
      fromVault: z.custom<AddressValue>(isAddressValue),
      toVault: z.custom<AddressValue>(isAddressValue),
      rebalanceAuthorizationSignature: z.custom<HexData>(isHexData),
      amount: z.custom<ITokenAmount>(isTokenAmount),
      slippagePercentage: z.string(),
      intervalSeconds: z.number().int().positive(),
      firstExecutionUnixTimestamp: z.number().int().positive(),
      deadlineUnixTimestamp: z.number().int().positive().optional(),
      maxTrades: z.number().int().positive(),
      neverBuyAbove: z.string().optional(),
      neverSellBelow: z.string().optional(),
      bearerToken: z.string(),
    }),
  )
  .mutation(async (opts) => {
    await verifyEarnBearerToken(opts.input.bearerToken)
    const { bearerToken: _bearerToken, ...orderParams } = opts.input
    return opts.ctx.armadaManager.dca.editBuyOrder(orderParams)
  })
