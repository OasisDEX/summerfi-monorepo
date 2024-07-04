import { z } from 'zod'
import { publicProcedure } from '../TRPC'

export const deposit = publicProcedure.input(z.object({})).query(async (opts): Promise<void> => {
  opts
  throw new Error('Not implemented')
})
