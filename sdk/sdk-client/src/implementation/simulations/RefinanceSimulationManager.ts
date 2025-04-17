import { IRefinanceSimulation } from '@summerfi/sdk-common'
import { IRefinanceParameters } from '@summerfi/sdk-common'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { IRefinanceSimulationManager } from '../../interfaces/simulations/IRefinanceSimulationManager'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/** @see IRefinanceSimulationManager */
export class RefinanceSimulationManager extends IRPCClient implements IRefinanceSimulationManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IRefinanceSimulationManager.simulateRefinancePosition */
  public async simulateRefinancePosition(
    refinanceParameters: IRefinanceParameters,
  ): Promise<IRefinanceSimulation> {
    return this.rpcClient.simulation.refinance.query(refinanceParameters)
  }
}
