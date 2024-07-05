import type { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { refinanceLendingToLending } from '@summerfi/simulator-service/strategies'
import { publicProcedure } from '../SDKTRPC'
import { isRefinanceParameters } from '@summerfi/sdk-common/orders'
import { z } from 'zod'

export const getRefinanceSimulation = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<ISimulation<SimulationType.Refinance>> => {
    if (!isRefinanceParameters(opts.input)) {
      throw new Error('Invalid refinance parameters')
    }

    return refinanceLendingToLending(opts.input, {
      swapManager: opts.ctx.swapManager,
      oracleManager: opts.ctx.oracleManager,
      protocolManager: opts.ctx.protocolManager,
    })
  })
