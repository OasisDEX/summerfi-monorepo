import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IAaveV3LendingPoolId, isAaveV3LendingPoolId } from './IAaveV3LendingPoolId'

/**
 * Unique signature to provide branded types to the interface
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
 * @description Type guard for IAaveV3LendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IAaveV3LendingPool
 */
export function isAaveV3LendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IAaveV3LendingPool {
  return AaveV3LendingPoolDataSchema.safeParse(maybeLendingPool).success
}
