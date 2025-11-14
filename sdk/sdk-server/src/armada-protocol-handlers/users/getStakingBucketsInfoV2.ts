import { publicProcedure } from '../../SDKTRPC'

export const getStakingBucketsInfoV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingBucketsInfoV2()
})
