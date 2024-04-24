import { ILendingPool, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import { IMakerLendingPoolId, MakerLendingPoolIdSchema } from './IMakerLendingPoolId'
import { z } from 'zod'

/**
 * @interface IMakerLendingPool
 * @description Represents a lending pool in the Maker protocol
 */
export interface IMakerLendingPool extends ILendingPool {
  /** The pool's ID */
  poolId: IMakerLendingPoolId
}

/**
 * @description Zod schema for IMakerLendingPool
 */
export const MakerLendingPoolSchema = z.object({
  ...LendingPoolSchema.shape,
  poolId: MakerLendingPoolIdSchema,
})

/**
 * @description Type guard for IMakerLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMakerLendingPool
 */
export function isMakerLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMakerLendingPool {
  return MakerLendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerLendingPool = {} as z.infer<typeof MakerLendingPoolSchema>
