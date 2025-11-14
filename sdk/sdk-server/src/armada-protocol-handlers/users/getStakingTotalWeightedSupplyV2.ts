import { publicProcedure } from '../../SDKTRPC'

export const getStakingTotalWeightedSupplyV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingTotalWeightedSupplyV2()
})
