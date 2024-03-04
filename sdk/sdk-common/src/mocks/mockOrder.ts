import type { Order } from '~sdk-common/orders'
import type { Wallet } from '~sdk-common/common/implementation/Wallet'
import type { Chain } from '~sdk-common/client/implementation/Chain'
import type { Simulation, SimulationType } from '~sdk-common/simulation'

export async function getMockOrder(params: {
  chain: Chain
  wallet: Wallet
  simulation: Simulation<SimulationType>
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
