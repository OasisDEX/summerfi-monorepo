import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { ArmadaFleet } from '@summerfi/sdk-common/common'
import { IArmadaFleetClient } from '../interfaces/IArmadaFleetClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @class ArmadaFleetClient
 * @see IArmadaFleetClient
 */
export class ArmadaFleetClient extends ArmadaFleet implements IArmadaFleetClient {
  private rpcClient: RPCMainClientType

  constructor(params: { rpcClient: RPCMainClientType; address: IAddress; chainInfo: IChainInfo }) {
    super(params)

    this.rpcClient = params.rpcClient
  }

  /** @see IArmadaFleetClient */
  public async deposit(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return this.rpcClient.earn.deposit.query({
      chainInfo: this.chainInfo,
      fleetAddress: this.address,
      user: params.user,
      amount: params.amount,
    })
  }

  /** @see IArmadaFleetClient */
  public async withdraw(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return this.rpcClient.earn.withdraw.query({
      chainInfo: this.chainInfo,
      fleetAddress: this.address,
      user: params.user,
      amount: params.amount,
    })
  }
}
