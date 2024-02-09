import { Wallet } from '~sdk/common'
import { User, Position, PositionId } from '~sdk/users'
import { Chain } from '~sdk/chains'
import { Protocol } from '~sdk/protocols'
import { Maybe } from '~sdk/utils'
import { Order, Simulation } from '~sdk/orders'
import { getMockOrder, getMockPosition } from '~sdk/mocks'

export class UsersClientImpl implements User {
  public readonly wallet: Wallet
  public readonly chain: Chain

  public constructor(params: { chain: Chain; wallet: Wallet }) {
    this.chain = params.chain
    this.wallet = params.wallet
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByProtocol(params: { protocol: Protocol }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByIds(params: { positionIds: PositionId[] }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  public async getPosition(params: { id: PositionId }): Promise<Maybe<Position>> {
    return getMockPosition({ chain: this.chain, wallet: this.wallet, id: params.id })
  }

  public async newOrder(params: { simulation: Simulation }): Promise<Order> {
    return getMockOrder({ chain: this.chain, wallet: this.wallet, simulation: params.simulation })
  }
}
