import { IArmadaSimulation, isArmadaParameters } from '@summerfi/armada-protocol-common'
import { ArmadaSimulator } from '@summerfi/armada-protocol-service'

import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'

export const getArmadaSimulation = publicProcedure
  .input(z.any())
  .query(async (opts): Promise<IArmadaSimulation> => {
    if (!isArmadaParameters(opts.input)) {
      throw new Error('Invalid Armada Protocol parameters')
    }

    return new ArmadaSimulator().simulate({
      simulationParams: opts.input,
      armadaManager: opts.ctx.armadaManager,
    })
  })
