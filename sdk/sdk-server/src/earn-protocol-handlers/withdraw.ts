import { z } from 'zod'
import { publicProcedure } from '../EarnProtocolTRPC'
import {
  isChainInfo,
  isUser,
  isTokenAmount,
  isAddress,
  type IChainInfo,
  type IAddress,
  type IUser,
  type ITokenAmount,
} from '@summerfi/sdk-common'

export const withdraw = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      fleetAddress: z.custom<IAddress>(isAddress),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.earnProtocolManager.withdraw(opts.input)
  })
