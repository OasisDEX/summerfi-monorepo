import { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { IEarnProtocolParameters } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function earnProtocolSimulation(params: {
  args: IEarnProtocolParameters
  earnProtocolManager: IEarnProtocolManager
}): Promise<ISimulation<SimulationType.EarnProtocol>> {
  return {} as unknown as ISimulation<SimulationType.EarnProtocol> //satisfies ISimulation<SimulationType.EarnProtocol>
}
