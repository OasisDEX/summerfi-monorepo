import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { ITokenAmount, isTokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const setFleetDepositCap = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      cap: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.setFleetDepositCap(opts.input)
  })
