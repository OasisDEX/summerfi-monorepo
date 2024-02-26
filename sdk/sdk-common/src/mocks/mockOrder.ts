import { Order, Simulation, SimulationType } from '~sdk-common/orders'
import { Wallet } from '~sdk-common/common/implementation'
import type { Chain } from '~sdk-common/client/implementation'

export async function getMockOrder(params: {
  chain: Chain
  wallet: Wallet
  simulation: Simulation<SimulationType, unknown>
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
