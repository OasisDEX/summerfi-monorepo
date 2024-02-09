import { Order, Simulation } from '~sdk'
import { Chain } from '~sdk/chains'
import { Wallet } from '~sdk/common'

export async function getMockOrder(params: {
  chain: Chain
  wallet: Wallet
  simulation: Simulation
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
