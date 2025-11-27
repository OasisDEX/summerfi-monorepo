import { publicProcedure } from '../../SDKTRPC'

export const getStakingStatsV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingStatsV2()
})
