import { isLendingPoolId } from '@summerfi/sdk-common'
import { publicProcedure } from '../SDKTRPC'
import { z } from 'zod'

export const getLendingPool = publicProcedure.input(z.any()).query(async (opts) => {
  if (!isLendingPoolId(opts.input)) {
    throw new Error('Invalid lending pool id')
  }

  return opts.ctx.protocolManager.getLendingPool(opts.input)
})
