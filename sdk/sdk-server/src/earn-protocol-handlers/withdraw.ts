import { z } from 'zod'
import { publicProcedure } from '../EarnProtocolTRPC'

export const withdraw = publicProcedure.input(z.any()).query(async (opts) => {
  // validate input

  return opts.ctx.earnProtocolManager.withdraw(opts.input)
})
