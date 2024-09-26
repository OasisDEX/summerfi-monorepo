import { isArmadaPoolId, type IArmadaPoolId } from '@summerfi/armada-protocol-common'
import { isAddress, isTokenAmount, type IAddress, type ITokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setArkMaxRebalanceOutflow = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      ark: z.custom<IAddress>(isAddress),
      maxRebalanceOutflow: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setArkMaxRebalanceOutflow(opts.input)
  })
