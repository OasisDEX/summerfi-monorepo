import { isRefinanceParameters } from '@summerfi/sdk-common'
import { IRefinanceSimulation } from '@summerfi/sdk-common'
import { refinanceLendingToLending } from '@summerfi/simulator-service/strategies'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const getRefinanceSimulation = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<IRefinanceSimulation> => {
    if (!isRefinanceParameters(opts.input)) {
      throw new Error('Invalid refinance parameters')
    }

    return refinanceLendingToLending(opts.input, {
      swapManager: opts.ctx.swapManager,
      oracleManager: opts.ctx.oracleManager,
      protocolManager: opts.ctx.protocolManager,
    })
  })
