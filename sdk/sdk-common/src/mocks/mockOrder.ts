import { Order, Simulation, SimulationType } from '~sdk-common/orders'
import { Chain } from '~sdk-common/chains'
import { Wallet } from '~sdk-common/common'

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
