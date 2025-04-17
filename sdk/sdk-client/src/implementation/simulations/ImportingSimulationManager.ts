import { IImportSimulation } from '@summerfi/sdk-common'
import { IImportPositionParameters } from '@summerfi/sdk-common'
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
  ): Promise<IImportSimulation> {
    return this.rpcClient.simulation.import.query(params)
  }
}
