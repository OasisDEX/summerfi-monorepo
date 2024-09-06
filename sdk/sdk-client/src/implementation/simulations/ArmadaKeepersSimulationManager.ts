import {
  IArmadaKeepersParameters,
  IArmadaKeepersSimulation,
} from '@summerfi/armada-protocol-common'
import { IRPCClient } from '../../interfaces/IRPCClient'

import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * Simulation manager client for the Keepers of the Armada protocol
 */
export class ArmadaSimulationManager extends IRPCClient {
  /** CONSTRUCTOR */
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /**
   * @name simulate
   * @description Simulates an operation on the Armada protocol for the Keepers of the protocol
   *
   * @param params Parameters for the simulation
   *
   * @returns IArmadaKeepersSimulation The result of the simulation
   */

  public async simulate(params: IArmadaKeepersParameters): Promise<IArmadaKeepersSimulation> {
    return this.rpcClient.simulation.armada.keepers.query(params)
  }
}
