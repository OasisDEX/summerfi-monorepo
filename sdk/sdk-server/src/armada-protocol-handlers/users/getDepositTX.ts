import { IArmadaPoolId, isArmadaPoolId } from '@summerfi/armada-protocol-common'
import { IUser, isTokenAmount, isUser, type ITokenAmount } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getDepositTX = publicProcedure
  .input(
    z.object({
      poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
      user: z.custom<IUser>(isUser),
      amount: z.custom<ITokenAmount>(isTokenAmount),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.getNewDepositTX(opts.input)
  })
