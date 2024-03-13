import { ChainFamilyMap } from '@summerfi/sdk-client'

import { SetupBuilderReturnType, setupBuilderParams } from '../utils/SetupBuilderParams'
import { OrderPlannerService } from '../../src/implementation/OrderPlannerService'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { getRefinanceSimulationMakerSpark } from '../utils/RefinanceSimulationMakerSpark'

describe('Order Planner Service', () => {
  let builderParams: SetupBuilderReturnType
  let orderPlannerService: OrderPlannerService

  beforeEach(() => {
    builderParams = setupBuilderParams({ chainInfo: ChainFamilyMap.Ethereum.Mainnet })

    orderPlannerService = new OrderPlannerService({
      deployments: builderParams.deploymentIndex,
      deploymentConfigTag: 'standard',
    })
  })

  it('should process refinance simulation correctly', async () => {
    const refinanceSimulation: Simulation<SimulationType.Refinance> =
      getRefinanceSimulationMakerSpark()

    orderPlannerService.buildOrder({
      ...builderParams,
      simulation: refinanceSimulation,
    })
  })
})
