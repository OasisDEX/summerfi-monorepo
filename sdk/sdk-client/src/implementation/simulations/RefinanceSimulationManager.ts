import { IRefinanceParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { RPCClientType } from '../../rpc/SDKClient'
import { IRPCClient } from '../../interfaces/IRPCClient'

export class RefinanceSimulationManager extends IRPCClient {
  constructor(params: { rpcClient: RPCClientType }) {
    super(params)
  }

  public async simulateRefinancePosition(
    params: IRefinanceParameters,
  ): Promise<ISimulation<SimulationType.Refinance>> {
    const refinanceParameters: IRefinanceParameters = {
      sourcePosition: {
        positionId: params.sourcePosition.positionId,
        debtAmount: params.sourcePosition.debtAmount,
        collateralAmount: params.sourcePosition.collateralAmount,
        pool: {
          poolId: params.sourcePosition.pool.poolId,
          protocol: params.sourcePosition.pool.protocol,
          type: params.sourcePosition.pool.type,
        },
      },
      targetPosition: {
        positionId: params.targetPosition.positionId,
        debtAmount: params.targetPosition.debtAmount,
        collateralAmount: params.targetPosition.collateralAmount,
        pool: {
          poolId: params.targetPosition.pool.poolId,
          protocol: params.targetPosition.pool.protocol,
          type: params.targetPosition.pool.type,
        },
      },
      slippage: params.slippage,
    }

    return this.rpcClient.simulation.refinance.query(refinanceParameters)
  }
}
