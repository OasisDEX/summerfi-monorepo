import { IEarnProtocolParameters } from '@summerfi/sdk-common/orders/interfaces/earn-protocol'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { IEarnProtocolSimulationManager } from '../../interfaces/simulations/IEarnProtocolSimulationManager'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/** @see IEarnProtocolSimulationManager */
export class EarnProtocolSimulationManager
  extends IRPCClient
  implements IEarnProtocolSimulationManager
{
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IEarnProtocolSimulationManager.simulate */
  public async simulate(
    params: IEarnProtocolParameters,
  ): Promise<ISimulation<SimulationType.EarnProtocol>> {
    return this.rpcClient.simulation.earn.query(params)
  }
}
