import { ILendingPool, ILendingPoolData, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import {
  IMakerLendingPoolId,
  IMakerLendingPoolIdData,
  MakerLendingPoolIdSchema,
} from './IMakerLendingPoolId'
import { z } from 'zod'

/**
 * @interface IMakerLendingPoolData
 * @description Represents a lending pool in the Maker protocol
 */
export interface IMakerLendingPoolData extends ILendingPoolData {
  /** The pool's ID */
  readonly id: IMakerLendingPoolIdData
}

/**
 * @interface IMakerLendingPool
 * @description Interface for the implementors of the lending pool
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMakerLendingPool extends ILendingPool, IMakerLendingPoolData {
  readonly id: IMakerLendingPoolId
}

/**
 * @description Zod schema for IMakerLendingPool
 */
export const MakerLendingPoolSchema = z.object({
  ...LendingPoolSchema.shape,
  id: MakerLendingPoolIdSchema,
})

/**
 * @description Type guard for IMakerLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMakerLendingPool
 */
export function isMakerLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMakerLendingPoolData {
  return MakerLendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerLendingPoolData = {} as z.infer<typeof MakerLendingPoolSchema>
