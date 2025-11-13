import { publicProcedure } from '../../SDKTRPC'

export const getProtocolRevenue = publicProcedure.query(async (opts) => {
  return opts.ctx.armadaManager.vaults.getProtocolRevenue()
})
