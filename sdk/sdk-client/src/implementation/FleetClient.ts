import { ChainInfo } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAddress, IChainInfo, ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'
import { IFleetClient } from '../interfaces/IFleetClient'
import { RPCEarnProtocolClientType } from '../rpc/SDKEarnProtocolClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

export class FleetCommanderClient extends IRPCClient implements IFleetClient {
  public readonly address: IAddress
  public readonly chainInfo: ChainInfo

  constructor(params: {
    rpcClient: RPCMainClientType
    earnProtocolClient: RPCEarnProtocolClientType
    address: IAddress
    chainInfo: IChainInfo
  }) {
    super(params)

    this.address = params.address
    this.chainInfo = params.chainInfo
  }

  /** @see IFleetCommanderClient */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async deposit(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return []
  }

  /** @see IFleetCommanderClient */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async withdraw(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]> {
    return []
  }
}

SerializationService.registerClass(FleetCommanderClient)
