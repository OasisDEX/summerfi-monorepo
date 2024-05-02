import { IImportPositionParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { RPCClientType } from '../../rpc/SDKClient'
import { IRPCClient } from '../../interfaces/IRPCClient'

export class ImportingSimulationManager extends IRPCClient {
  constructor(params: { rpcClient: RPCClientType }) {
    super(params)
  }

  public async simulateImportPosition(
    params: IImportPositionParameters,
  ): Promise<ISimulation<SimulationType.ImportPosition>> {
    return this.rpcClient.simulation.import.query(params)
  }
}
