import { Order, SimulationType } from '~sdk-common/orders'
import { Chain } from '~sdk-common/chains'
import { Wallet } from '~sdk-common/common'

export async function getMockOrder(params: {
  chain: Chain
  wallet: Wallet
  simulation: any // Simulation<SimulationType, unknown> TODO: fix it
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
