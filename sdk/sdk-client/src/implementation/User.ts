import {
  Address,
  ChainInfo,
  Maybe,
  Position,
  PositionId,
  Wallet,
} from '@summerfi/sdk-common/common'
import { Protocol } from '@summerfi/sdk-common/protocols'
import { getMockPosition } from '../mocks/mockPosition'
import { getMockOrder } from '../mocks/mockOrder'
import { Order } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '../interfaces/IUser'

export class User implements IUser {
  public readonly wallet: Wallet
  public readonly chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo; walletAddress: Address }) {
    this.chainInfo = params.chainInfo
    this.wallet = Wallet.createFrom({ address: params.walletAddress })
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
    return getMockPosition({ chainInfo: this.chainInfo, wallet: this.wallet, id: params.id })
  }

  public async newOrder(params: { simulation: Simulation<SimulationType> }): Promise<Order> {
    return getMockOrder({
      user: this,
      positionsManager: { address: Address.ZeroAddressEthereum },
      simulation: params.simulation,
    })
  }
}
