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
import { TRPCError } from '@trpc/server'

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
    try {
      return await opts.ctx.armadaManager.bridge.getBridgeTx(opts.input)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to call getBridgeTx', error)

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to call getBridgeTx`,
        cause: error,
      })
    }
  })
