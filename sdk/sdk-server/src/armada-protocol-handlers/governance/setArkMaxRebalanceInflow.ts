import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { IAddress, ITokenAmount, isAddress, isTokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setArkMaxRebalanceInflow = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      ark: z.custom<IAddress>(isAddress),
      maxRebalanceInflow: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setArkMaxRebalanceInflow(opts.input)
  })
