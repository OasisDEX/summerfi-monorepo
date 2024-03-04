import { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from './IPool'
import type { PoolType } from './PoolType'

/**
 * @interface SupplyPool
 * @description Represents a supply pool. Provides information about the supply token
 */
export interface SupplyPool extends IPool {
  type: PoolType.Supply
  supplyToken: Token
}
