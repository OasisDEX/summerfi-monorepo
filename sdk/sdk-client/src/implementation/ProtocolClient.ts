import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { ILendingPool, ILendingPoolIdData, ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolClient } from '../interfaces/IProtocolClient'
import { RPCClientType } from '../rpc/SDKClient'
import { SerializationService } from '@summerfi/sdk-common/services'
import { Protocol } from '@summerfi/sdk-common'

export class ProtocolClient extends Protocol implements IProtocolClient {
  public readonly name: ProtocolName
  public readonly chainInfo: ChainInfo
  private readonly _rpcClient: RPCClientType

  constructor(params: { rpcClient: RPCClientType; name: ProtocolName; chainInfo: ChainInfo }) {
    super(params)

    this.name = params.name
    this.chainInfo = params.chainInfo
    this._rpcClient = params.rpcClient
  }

  getLendingPool(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPool>> {
    return this._rpcClient.getLendingPool.query({
      poolId: params.poolId,
    })
  }

  // TODO: Implement this method
  // getPoolExtendedInfo(params: { poolId: IPoolId }): Promise<Maybe<IPoolExtendedInfo>> {
  //   return this._rpcClient.getPoolExtendedInfo.query({
  //     poolId: params.poolId,
  //   })
  // }

  /**
   * Compare if the passed protocol is equal to the current protocol
   * @param protocol The protocol to compare
   * @returns true if the protocols are equal
   *
   * Equality is determined by the name and chain information
   */
  equals(protocol: ProtocolClient): boolean {
    return this.name === protocol.name && this.chainInfo.equals(protocol.chainInfo)
  }
}

SerializationService.registerClass(ProtocolClient)
