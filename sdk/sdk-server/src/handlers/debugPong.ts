import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const pong = publicProcedure.input(z.any()).query(async (): Promise<string> => {
  return 'pong'
})
