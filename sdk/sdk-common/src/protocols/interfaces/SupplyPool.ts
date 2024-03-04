import { Token } from '~sdk-common/common/implementation'
import { IPool, PoolType } from './IPool'

/**
 * @interface SupplyPool
 * @description Represents a supply pool. Provides information about the supply token
 */
export interface SupplyPool extends IPool {
  type: PoolType.Supply
  supplyToken: Token
}
