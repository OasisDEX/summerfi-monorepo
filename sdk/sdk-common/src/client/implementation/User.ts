import { Maybe } from '~sdk-common/utils'
import { Order } from '~sdk-common/orders'
import { getMockOrder, getMockPosition } from '~sdk-common/mocks'
import type { Chain } from '~sdk-common/client/implementation/Chain'
import type { IUser } from '~sdk-common/client/interfaces/IUser'
import { Simulation, SimulationType } from '~sdk-common/simulation'
import type { Position } from '~sdk-common/common/implementation/Position'
import type { PositionId } from '~sdk-common/common/implementation/PositionId'
import type { Wallet } from '~sdk-common/common/implementation/Wallet'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'

export class User implements IUser {
  public readonly wallet: Wallet
  public readonly chain: Chain

  public constructor(params: { chain: Chain; wallet: Wallet }) {
    this.chain = params.chain
    this.wallet = params.wallet
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByProtocol(_params: { protocol: Protocol }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByIds(_params: { positionIds: PositionId[] }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPosition(params: { id: PositionId }): Promise<Maybe<Position>> {
    // TODO: Implement
    // for client impl we'll use communication layer client
    // to get the position from the network
    // but for server we'll use a communication layer caller
    return getMockPosition({ chain: this.chain, wallet: this.wallet, id: params.id })
  }

  public async newOrder(params: { simulation: Simulation<SimulationType> }): Promise<Order> {
    return getMockOrder({ chain: this.chain, wallet: this.wallet, simulation: params.simulation })
  }
}
