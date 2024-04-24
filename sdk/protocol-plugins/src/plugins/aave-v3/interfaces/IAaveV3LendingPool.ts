import { ILendingPool, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'
import { AaveV3LendingPoolIdSchema, IAaveV3LendingPoolId } from './IAaveV3LendingPoolId'

/**
 * @interface IAaveV3LendingPool
 * @description Represents a lending pool in the Aave V3 protocol
 */
export interface IAaveV3LendingPool extends ILendingPool {
  /** The lending pool's ID */
  poolId: IAaveV3LendingPoolId
}

/**
 * @description Zod schema for IAaveV3LendingPool
 */
export const AaveV3LendingPoolSchema = z.object({
  ...LendingPoolSchema.shape,
  poolId: AaveV3LendingPoolIdSchema,
})

/**
 * @description Type guard for IAaveV3LendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IAaveV3LendingPool
 */
export function isAaveV3LendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IAaveV3LendingPool {
  return AaveV3LendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3LendingPool = {} as z.infer<typeof AaveV3LendingPoolSchema>
