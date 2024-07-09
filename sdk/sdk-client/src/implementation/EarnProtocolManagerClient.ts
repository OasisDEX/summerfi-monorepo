import { Maybe } from '@summerfi/sdk-common/common'
import { IEarnProtocolManagerClient } from '../interfaces/IEarnProtocolManagerClient'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { FleetClient } from './FleetClient'
import { IFleetClient } from '../interfaces/IFleetClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

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
  public getFleet(params: { address: IAddress }): Maybe<IFleetClient> {
    return new FleetClient({
      ...params,
      rpcClient: this.rpcClient,
      chainInfo: this.chainInfo,
    })
  }
}
