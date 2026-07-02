import { ILendingPool, ILendingPoolIdData, ILendingPoolInfo } from '@summerfi/sdk-common'
import type { ChainInfo, Maybe } from '@summerfi/sdk-common'
import { IProtocolsManagerClient } from '../interfaces/IProtocolsManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @see IProtocolsManagerClient
 */
export class ProtocolsManagerClient extends IRPCClient implements IProtocolsManagerClient {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { rpcClient: RPCMainClientType; chainInfo: ChainInfo }) {
    super(params)

    this._chainInfo = params.chainInfo
  }

  /**
   * Fetches a lending pool by its identifier.
   *
   * @param params - Parameters object.
   * @param params.poolId - Identifying data of the lending pool to fetch.
   * @returns A promise resolving to the lending pool, or a nullish {@link Maybe} if not found.
   */
  getLendingPool(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPool>> {
    return this.rpcClient.protocols.getLendingPool.query(params.poolId)
  }

  /**
   * Fetches extended information (rates, caps, etc.) for a lending pool by its identifier.
   *
   * @param params - Parameters object.
   * @param params.poolId - Identifying data of the lending pool to fetch info for.
   * @returns A promise resolving to the lending pool info, or a nullish {@link Maybe} if not found.
   */
  getLendingPoolInfo(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPoolInfo>> {
    return this.rpcClient.protocols.getLendingPoolInfo.query(params.poolId)
  }
}
