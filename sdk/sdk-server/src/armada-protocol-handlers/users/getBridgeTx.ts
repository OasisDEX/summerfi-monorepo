import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import {
  isUser,
  type IUser,
  isChainInfo,
  type IChainInfo,
  isAddress,
  type IAddress,
  isTokenAmount,
  type ITokenAmount,
} from '@summerfi/sdk-common'

export const getBridgeTx = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      recipient: z.custom<IAddress>(isAddress),
      sourceChain: z.custom<IChainInfo>(isChainInfo),
      targetChain: z.custom<IChainInfo>(isChainInfo),
      amount: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.bridge.getBridgeTx(opts.input)
  })
