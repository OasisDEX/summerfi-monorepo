import { IRPCClient } from '../../interfaces/IRPCClient'

import { IArmadaParameters, IArmadaSimulation } from '@summerfi/armada-protocol-common'
import { IArmadaSimulationManager } from '../../interfaces/simulations/IArmadaSimulationManager'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/** @see IArmadaSimulationManager */
export class ArmadaSimulationManager extends IRPCClient implements IArmadaSimulationManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaSimulationManager.simulate */
  public async simulate(params: IArmadaParameters): Promise<IArmadaSimulation> {
    return this.rpcClient.simulation.earn.query(params)
  }
}
