import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { EarnProtocolFleet } from '@summerfi/sdk-common/common'
import { IEarnProtocolFleetClient } from '../interfaces/IEarnProtocolFleetClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @class EarnProtocolFleetClient
 * @see IEarnProtocolFleetClient
 */
export class EarnProtocolFleetClient extends EarnProtocolFleet implements IEarnProtocolFleetClient {
  private rpcClient: RPCMainClientType

  constructor(params: { rpcClient: RPCMainClientType; address: IAddress; chainInfo: IChainInfo }) {
    super(params)

    this.rpcClient = params.rpcClient
  }

  /** @see IEarnProtocolFleetClient */
  public async deposit(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return this.rpcClient.earn.deposit.query({
      chainInfo: this.chainInfo,
      fleetAddress: this.address,
      user: params.user,
      amount: params.amount,
    })
  }

  /** @see IEarnProtocolFleetClient */
  public async withdraw(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return this.rpcClient.earn.withdraw.query({
      chainInfo: this.chainInfo,
      fleetAddress: this.address,
      user: params.user,
      amount: params.amount,
    })
  }
}
