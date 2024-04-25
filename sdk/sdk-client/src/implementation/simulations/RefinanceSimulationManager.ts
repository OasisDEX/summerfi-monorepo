import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, RefinanceSimulationTypes } from '@summerfi/sdk-common/simulation'
import { RPCClientType } from '../../rpc/SDKClient'
import { IRPCClient } from '../../interfaces/IRPCClient'

export class RefinanceSimulationManager extends IRPCClient {
  constructor(params: { rpcClient: RPCClientType }) {
    super(params)
  }

  public async simulateRefinancePosition(
    params: IRefinanceParameters,
  ): Promise<ISimulation<RefinanceSimulationTypes>> {
    return this.rpcClient.simulation.refinance.query(params)
  }
}
