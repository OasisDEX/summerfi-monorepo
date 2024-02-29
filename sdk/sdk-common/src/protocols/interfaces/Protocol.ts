import type { Maybe } from '~sdk-common/common/aliases'
import { IProtocolId } from './IDs'
import { IPool } from './IPool'
import { PoolParameters } from './PoolParameters'
import { ProtocolParameters } from './ProtocolParameters'

/**
 * @interface Protocol
 * @description Represents a protocol. Provides methods for getting pools
 */
export interface Protocol {
  protocolId: IProtocolId

  getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>>

  getAllPools(params: { protocolParameters?: ProtocolParameters }): Promise<IPool[]>
}
