import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUndelegateTx = publicProcedure.input(z.undefined()).query(async (opts) => {
  return opts.ctx.armadaManager.governance.getUndelegateTx()
})
