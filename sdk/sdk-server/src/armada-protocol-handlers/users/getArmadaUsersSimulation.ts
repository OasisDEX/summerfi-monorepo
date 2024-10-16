import {
  ArmadaUsersParametersDataSchema,
  IArmadaUsersSimulation,
} from '@summerfi/armada-protocol-common'
import { ArmadaUsersParameters, ArmadaUsersSimulator } from '@summerfi/armada-protocol-service'

import { publicProcedure } from '../../SDKTRPC'

export const getArmadaUsersSimulation = publicProcedure
  .input(ArmadaUsersParametersDataSchema)
  .query(async (opts): Promise<IArmadaUsersSimulation> => {
    return new ArmadaUsersSimulator().simulate({
      simulationParams: ArmadaUsersParameters.createFrom(opts.input),
      armadaManager: opts.ctx.armadaManager,
    })
  })
