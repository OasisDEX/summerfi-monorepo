import { isLendingPoolId } from '@summerfi/sdk-common'
import { publicProcedure } from '../TRPC'
import { z } from 'zod'

export const getLendingPoolInfo = publicProcedure.input(z.any()).query(async (opts) => {
  if (!isLendingPoolId(opts.input)) {
    throw new Error('Invalid lending pool id')
  }

  return opts.ctx.protocolManager.getLendingPoolInfo(opts.input)
})
