import { Wallet } from '~sdk-common/common'
import { User, Position, PositionId } from '~sdk-common/users'
import { Chain } from '~sdk-common/chains'
import { Protocol } from '~sdk-common/protocols'
import { Maybe } from '~sdk-common/utils'
import { Order, SimulationType } from '~sdk-common/orders'
import { getMockOrder, getMockPosition } from '~sdk-common/mocks'

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

  public async newOrder(params: {
    simulation: any // TODO: fix it
  }): Promise<Order> {
    return getMockOrder({ chain: this.chain, wallet: this.wallet, simulation: params.simulation })
  }
}
