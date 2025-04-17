import { ILendingPool, ILendingPoolIdData, ILendingPoolInfo } from '@summerfi/sdk-common'
import type { ChainInfo, Maybe } from '@summerfi/sdk-common'
import { IProtocolsManagerClient } from '../interfaces/IProtocolsManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @class ProtocolsManagerClient
 * @see IProtocolsManagerClient
 */
export class ProtocolsManagerClient extends IRPCClient implements IProtocolsManagerClient {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { rpcClient: RPCMainClientType; chainInfo: ChainInfo }) {
    super(params)

    this._chainInfo = params.chainInfo
  }

  getLendingPool(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPool>> {
    return this.rpcClient.protocols.getLendingPool.query(params.poolId)
  }

  getLendingPoolInfo(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPoolInfo>> {
    return this.rpcClient.protocols.getLendingPoolInfo.query(params.poolId)
  }
}
