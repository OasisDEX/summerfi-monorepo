import {
  ArmadaKeepersParametersDataSchema,
  IArmadaKeepersSimulation,
} from '@summerfi/armada-protocol-common'
import { ArmadaKeepersParameters, ArmadaKeepersSimulator } from '@summerfi/armada-protocol-service'

import { publicProcedure } from '../../SDKTRPC'

export const getArmadaKeepersSimulation = publicProcedure
  .input(ArmadaKeepersParametersDataSchema)
  .query(async (opts): Promise<IArmadaKeepersSimulation> => {
    return new ArmadaKeepersSimulator().simulate({
      simulationParams: ArmadaKeepersParameters.createFrom(opts.input),
      armadaManager: opts.ctx.armadaManager,
    })
  })
