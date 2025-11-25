import { publicProcedure } from '../../SDKTRPC'

export const getStakingConfigV2 = publicProcedure.query(async (opts) => {
  return await opts.ctx.armadaManager.governance.getStakingConfigV2()
})
