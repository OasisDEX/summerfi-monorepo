import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const pingHandler = publicProcedure.input(z.any()).query(async (args) => {
  return {
    input: JSON.stringify(args.input, null, 2),
  }
})
