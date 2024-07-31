import { PoolType } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IAaveV3LendingPoolId, isAaveV3LendingPoolId } from './IAaveV3LendingPoolId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IAaveV3LendingPool
 * @description Represents a lending pool in the Aave V3 protocol
 */
export interface IAaveV3LendingPool extends ILendingPool, IAaveV3LendingPoolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The lending pool's ID */
  readonly id: IAaveV3LendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IAaveV3LendingPool
 */
export const AaveV3LendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: z.custom<IAaveV3LendingPoolId>((val) => isAaveV3LendingPoolId(val)),
})

/**
 * Type for the data part of IAaveV3LendingPool
 */
export type IAaveV3LendingPoolData = Readonly<z.infer<typeof AaveV3LendingPoolDataSchema>>

/**
 * Type for the parameters of the IAaveV3LendingPool interface
 */
export type IAaveV3LendingPoolParameters = Omit<IAaveV3LendingPoolData, 'type'>

/**
 * @description Type guard for IAaveV3LendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IAaveV3LendingPool
 */
export function isAaveV3LendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IAaveV3LendingPool {
  return AaveV3LendingPoolDataSchema.safeParse(maybeLendingPool).success
}
