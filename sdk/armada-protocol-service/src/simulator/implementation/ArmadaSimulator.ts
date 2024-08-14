import {
  IArmadaManager,
  IArmadaParameters,
  IArmadaSimulation,
} from '@summerfi/armada-protocol-common'

/**
 * @class ArmadaSimulator
 * @description Simulator for the Armada protocol
 */
export class ArmadaSimulator {
  constructor() {
    // Empty constructor
  }

  async simulate(_: {
    args: IArmadaParameters
    armadaManager: IArmadaManager
  }): Promise<IArmadaSimulation> {
    // TODO: Implement
    return {} as unknown as IArmadaSimulation
  }
}
