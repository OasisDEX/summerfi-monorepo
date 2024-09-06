import { IRPCClient } from '../../interfaces/IRPCClient'

import { IArmadaUsersParameters, IArmadaUsersSimulation } from '@summerfi/armada-protocol-common'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * Simulation manager client for the Users of the Armada protocol
 */
export class ArmadaUsersSimulationManager extends IRPCClient {
  /** CONSTRUCTOR */
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /**
   * @name simulate
   * @description Simulates an operation on the Armada protocol for the Users of the protocol
   *
   * @param params Parameters for the simulation
   *
   * @returns IArmadaUsersSimulation The result of the simulation
   */
  public async simulate(params: IArmadaUsersParameters): Promise<IArmadaUsersSimulation> {
    return this.rpcClient.simulation.armada.users.query(params)
  }
}
