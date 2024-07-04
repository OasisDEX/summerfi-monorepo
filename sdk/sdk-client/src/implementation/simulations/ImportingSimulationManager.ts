import { IImportPositionParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { IRPCClient } from '../../interfaces/IRPCClient'

export class ImportingSimulationManager extends IRPCClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  public async simulateImportPosition(
    params: IImportPositionParameters,
  ): Promise<ISimulation<SimulationType.ImportPosition>> {
    return this.rpcClient.simulation.import.query(params)
  }
}
