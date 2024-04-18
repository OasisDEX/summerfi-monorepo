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
    const importPositionParameters: IImportPositionParameters = {
      externalPosition: {
        position: {
          type: params.externalPosition.position.type,
          positionId: params.externalPosition.position.positionId,
          debtAmount: params.externalPosition.position.debtAmount,
          collateralAmount: params.externalPosition.position.collateralAmount,
          pool: {
            poolId: params.externalPosition.position.pool.poolId,
            protocol: params.externalPosition.position.pool.protocol,
            type: params.externalPosition.position.pool.type,
          },
        },
        externalId: {
          type: params.externalPosition.externalId.type,
          address: params.externalPosition.externalId.address,
        },
      },
    }

    return this.rpcClient.simulation.import.query(importPositionParameters)
  }
}
