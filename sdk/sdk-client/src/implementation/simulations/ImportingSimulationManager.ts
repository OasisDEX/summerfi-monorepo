import { IImportPositionParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { IImportingSimulationManager } from '../../interfaces/simulations/IImportingSimulationManager'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/** @see IImportingSimulationManager */
export class ImportingSimulationManager extends IRPCClient implements IImportingSimulationManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IImportingSimulationManager.simulateImportPosition */
  public async simulateImportPosition(
    params: IImportPositionParameters,
  ): Promise<ISimulation<SimulationType.ImportPosition>> {
    return this.rpcClient.simulation.import.query(params)
  }
}
