import { isEarnProtocolParameters } from '@summerfi/sdk-common/orders'
import { IEarnProtocolSimulation } from '@summerfi/sdk-common/simulation'
import { earnProtocolSimulation } from '@summerfi/simulator-service/strategies'
import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const getEarnProtocolSimulation = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<IEarnProtocolSimulation> => {
    if (!isEarnProtocolParameters(opts.input)) {
      throw new Error('Invalid Earn Protocol parameters')
    }

    return earnProtocolSimulation({
      args: opts.input,
      earnProtocolManager: opts.ctx.earnProtocolManager,
    })
  })
