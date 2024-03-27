import { Maybe } from '@summerfi/sdk-common/common'
import { IPool, IPoolId, IProtocol } from '@summerfi/sdk-common/protocols'

export interface IProtocolClient extends IProtocol {
  getPool(params: { poolId: IPoolId }): Promise<Maybe<IPool>>
}
