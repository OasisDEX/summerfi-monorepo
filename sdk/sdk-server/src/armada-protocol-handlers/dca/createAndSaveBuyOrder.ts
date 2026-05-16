import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const createAndSaveBuyOrder = publicProcedure
  .input(
    z.object({
      userAddress: z.custom<AddressValue>(isAddressValue),
      chainId: z.custom<ChainId>(isChainId),
      fromVault: z.custom<AddressValue>(isAddressValue),
      toVault: z.custom<AddressValue>(isAddressValue),
      amount: z.string(),
      slippagePercentage: z.string(),
      intervalSeconds: z.number().int().positive(),
      firstExecutionUnixTimestamp: z.number().int().positive(),
      deadlineUnixTimestamp: z.number().int().positive().optional(),
      maxTrades: z.number().int().positive(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.createAndSaveBuyOrder(opts.input)
  })
