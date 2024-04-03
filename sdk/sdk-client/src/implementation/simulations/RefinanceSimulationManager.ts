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
      position: {
        positionId: params.position.positionId,
        debtAmount: params.position.debtAmount,
        collateralAmount: params.position.collateralAmount,
        pool: {
          poolId: params.position.pool.poolId,
          protocol: params.position.pool.protocol,
          type: params.position.pool.type,
        },
      },
      targetPool: {
        poolId: params.targetPool.poolId,
        protocol: params.targetPool.protocol,
        type: params.targetPool.type,
      },
      slippage: params.slippage,
    }

    return this.rpcClient.simulation.refinance.query(refinanceParameters)
  }
}
