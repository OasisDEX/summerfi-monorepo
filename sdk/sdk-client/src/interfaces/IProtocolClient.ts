import { Maybe } from '@summerfi/sdk-common/common'
import { IPool, IProtocol } from '@summerfi/sdk-common/protocols'
import { PoolIds } from '@summerfi/protocol-manager'
export interface IProtocolClient extends IProtocol {
  getPool(params: { poolId: PoolIds }): Promise<Maybe<IPool>>
}
