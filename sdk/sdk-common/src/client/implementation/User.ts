import { Address } from '../../common'
import { Maybe } from '../../common/aliases/Maybe'
import { Position } from '../../common/implementation/Position'
import { PositionId } from '../../common/implementation/PositionId'
import { Wallet } from '../../common/implementation/Wallet'
import { getMockOrder } from '../../mocks/mockOrder'
import { getMockPosition } from '../../mocks/mockPosition'
import { Order } from '../../orders/interfaces/common/Order'
import { Protocol } from '../../protocols/implementation/Protocol'
import { SimulationType } from '../../simulation/enums'
import { Simulation } from '../../simulation/simulation'
import { IUser } from '../interfaces/IUser'
import { Chain } from './Chain'

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
    return getMockOrder({
      user: this,
      positionsManager: { address: Address.ZeroAddressEthereum },
      simulation: params.simulation,
    })
  }
}
