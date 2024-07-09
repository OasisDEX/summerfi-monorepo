import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { IEarnProtocolFleetClient } from '../interfaces/IEarnProtocolFleetClient'
import { IEarnProtocolManagerClient } from '../interfaces/IEarnProtocolManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { EarnProtocolFleetClient } from './EarnProtocolFleetClient'

/**
 * @name EarnProtocolManagerClient
 * @description Implementation of the IChainsManager interface for the SDK Client
 */
export class EarnProtocolManagerClient extends IRPCClient implements IEarnProtocolManagerClient {
  public readonly chainInfo: IChainInfo

  constructor(params: { rpcClient: RPCMainClientType; chainInfo: IChainInfo }) {
    super(params)

    this.chainInfo = params.chainInfo
  }

  /** @see IEarnProtocolManagerClient */
  public getFleet(params: { address: IAddress }): Maybe<IEarnProtocolFleetClient> {
    return new EarnProtocolFleetClient({
      ...params,
      rpcClient: this.rpcClient,
      chainInfo: this.chainInfo,
    })
  }
}
