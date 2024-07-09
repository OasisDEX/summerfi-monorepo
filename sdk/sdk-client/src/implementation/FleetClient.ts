import { ChainInfo } from '@summerfi/sdk-common/common'
import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { IFleetClient } from '../interfaces/IFleetClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

export class FleetClient extends IRPCClient implements IFleetClient {
  public readonly address: IAddress
  public readonly chainInfo: ChainInfo

  constructor(params: { rpcClient: RPCMainClientType; address: IAddress; chainInfo: IChainInfo }) {
    super(params)

    this.address = params.address
    this.chainInfo = params.chainInfo
  }

  /** @see IFleetClient */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deposit(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return this.rpcClient.earnProtocol.deposit.query({
      chainInfo: this.chainInfo,
      fleetAddress: this.address,
      user: params.user,
      amount: params.amount,
    })
  }

  /** @see IFleetClient */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async withdraw(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return this.rpcClient.earnProtocol.withdraw.query({
      chainInfo: this.chainInfo,
      fleetAddress: this.address,
      user: params.user,
      amount: params.amount,
    })
  }
}
