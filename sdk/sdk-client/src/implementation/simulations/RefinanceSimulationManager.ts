import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { IRPCClient } from '../../interfaces/IRPCClient'

export class RefinanceSimulationManager extends IRPCClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  public async simulateRefinancePosition(
    refinanceParameters: IRefinanceParameters,
  ): Promise<ISimulation<SimulationType.Refinance>> {
    return this.rpcClient.simulation.refinance.query(refinanceParameters)
  }
}
