import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getDelegationChainLength = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    try {
      return await opts.ctx.armadaManager.governance.getDelegationChainLength(opts.input)
    } catch (error: unknown) {
      console.error(`Failed to get delegation chain length for user ${opts.input.user}: ${error}`)
      throw error instanceof Error ? error : new Error(String(error))
    }
  })
