import { z } from 'zod'
import { publicProcedure } from '../EarnProtocolTRPC'

export const deposit = publicProcedure.input(z.any()).query(async (opts) => {
  // validate input

  return opts.ctx.earnProtocolManager.deposit(opts.input)
})
