import { IEarnProtocolManager } from '@summerfi/earn-protocol-common'
import { IEarnProtocolParameters } from '@summerfi/sdk-common/orders'
import { IEarnProtocolSimulation } from '@summerfi/sdk-common/simulation'

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function earnProtocolSimulation(params: {
  args: IEarnProtocolParameters
  earnProtocolManager: IEarnProtocolManager
}): Promise<IEarnProtocolSimulation> {
  return {} as unknown as IEarnProtocolSimulation
}
