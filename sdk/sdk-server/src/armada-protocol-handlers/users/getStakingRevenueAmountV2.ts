import { publicProcedure } from '../../SDKTRPC'

export const getStakingRevenueAmountV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingRevenueAmountV2()
})
