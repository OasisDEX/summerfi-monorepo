import { Maybe } from '~sdk/utils'
import { ProtocolId } from './IDs'
import { Pool } from './Pool'
import { PoolParameters } from './PoolParameters'
import { ProtocolParameters } from './ProtocolParameters'

/**
 * @interface Protocol
 * @description Represents a protocol. Provides methods for getting pools
 */
export interface Protocol {
  protocolId: ProtocolId

  getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<Pool>>
  getAllPools(params: { protocolParameters?: ProtocolParameters }): Promise<Pool[]>
}
