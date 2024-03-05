import type { Maybe } from '~sdk-common/common/aliases/Maybe'
import { PoolParameters } from './PoolParameters'
import { ProtocolParameters } from './ProtocolParameters'
import { ProtocolName } from './ProtocolName'
import { IPool } from './IPool'

/**
 * @interface Protocol
 * @description Represents a protocol. Provides methods for getting pools
 */
export interface Protocol {
  name: ProtocolName

  getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>>

  getAllPools(params: { protocolParameters?: ProtocolParameters }): Promise<IPool[]>
}
