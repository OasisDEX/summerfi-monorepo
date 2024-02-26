import { Maybe } from '~sdk-common/utils'
import { Pool } from './Pool'
import { PoolParameters } from './PoolParameters'
import { ProtocolParameters } from './ProtocolParameters'
import { ProtocolName } from './ProtocolName'

/**
 * @interface Protocol
 * @description Represents a protocol. Provides methods for getting pools
 */
export interface Protocol {
  name: ProtocolName

  getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<Pool>>

  getAllPools(params: { protocolParameters?: ProtocolParameters }): Promise<Pool[]>
}
