import { Maybe } from '@summerfi/sdk-common/common'
import {
  IPool,
  IProtocol,
  PoolParameters,
  ProtocolParameters,
} from '@summerfi/sdk-common/protocols'

export interface IProtocolClient extends IProtocol {
  getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>>
}
