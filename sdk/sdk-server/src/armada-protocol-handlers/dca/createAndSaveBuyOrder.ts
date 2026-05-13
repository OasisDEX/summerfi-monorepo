import {
  isAddress,
  isChainInfo,
  isUser,
  type IAddress,
  type IChainInfo,
  type IUser,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const createAndSaveBuyOrder = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      fromVault: z.custom<IAddress>(isAddress),
      toVault: z.custom<IAddress>(isAddress),
      amount: z.string(),
      slippage: z.string(),
      intervalSeconds: z.number().int().positive(),
      ensoRouterAddress: z.custom<IAddress>(isAddress),
      nextExecutionAt: z.number().int().positive().optional(),
      deadline: z.string().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.createAndSaveBuyOrder(opts.input)
  })
