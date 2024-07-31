import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { IArmadaFleetClient } from '../interfaces/IArmadaFleetClient'
import { IArmadaManagerClient } from '../interfaces/IArmadaManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ArmadaFleetClient } from './ArmadaFleetClient'

/**
 * @name ArmadaManagerClient
 * @description Implementation of the IChainsManager interface for the SDK Client
 */
export class ArmadaManagerClient extends IRPCClient implements IArmadaManagerClient {
  public readonly chainInfo: IChainInfo

  constructor(params: { rpcClient: RPCMainClientType; chainInfo: IChainInfo }) {
    super(params)

    this.chainInfo = params.chainInfo
  }

  /** @see IArmadaManagerClient */
  public getFleet(params: { address: IAddress }): Maybe<IArmadaFleetClient> {
    return new ArmadaFleetClient({
      address: params.address,
      rpcClient: this.rpcClient,
      chainInfo: this.chainInfo,
    })
  }
}
