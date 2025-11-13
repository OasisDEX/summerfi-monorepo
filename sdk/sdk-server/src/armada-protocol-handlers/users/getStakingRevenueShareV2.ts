import { publicProcedure } from '../../SDKTRPC'

export const getStakingRevenueShareV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingRevenueShareV2()
})
