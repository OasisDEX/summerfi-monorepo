import { publicProcedure } from '../../SDKTRPC'

export const getProtocolTvl = publicProcedure.query(async (opts) => {
  return opts.ctx.armadaManager.vaults.getProtocolTvl()
})
