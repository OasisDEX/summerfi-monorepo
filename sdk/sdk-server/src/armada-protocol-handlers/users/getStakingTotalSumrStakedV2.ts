import { publicProcedure } from '../../SDKTRPC'

export const getStakingTotalSumrStakedV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingTotalSumrStakedV2()
})
