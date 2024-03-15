import { Chain, IUser } from '@summerfi/sdk-client'
import {
  Address,
  ChainInfo,
  Maybe,
  Position,
  PositionId,
  Wallet,
} from '@summerfi/sdk-common/common'
import { Order } from '@summerfi/sdk-common/orders'
import { Protocol } from '@summerfi/sdk-common/protocols'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'

export class UserMock implements IUser {
  wallet: Wallet
  chainInfo: ChainInfo

  constructor(params: { chainInfo: ChainInfo; walletAddress: Address }) {
    this.chainInfo = params.chainInfo
    this.wallet = Wallet.createFrom({ address: params.walletAddress })
  }

  public async getPositionsByProtocol(_params: { protocol: Protocol }): Promise<Position[]> {
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByIds(_params: { positionIds: PositionId[] }): Promise<Position[]> {
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPosition(params: { id: PositionId }): Promise<Maybe<Position>> {
    return undefined
  }

  public async newOrder(params: { simulation: Simulation<SimulationType> }): Promise<Order> {
    return {} as Order
  }
}
