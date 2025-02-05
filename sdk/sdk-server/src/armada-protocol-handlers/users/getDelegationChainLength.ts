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
    } catch (error) {
      console.error(`Failed to get delegation chain length: ${error}`)
      throw new Error(`Failed to get delegation chain length: ${error}`)
    }
  })
