import { ILendingPoolData, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import {
  IMorphoLendingPoolId,
  IMorphoLendingPoolIdData,
  MorphoLendingPoolIdSchema,
} from './IMorphoLendingPoolId'
import { ILendingPool, PoolType } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMorphoLendingPoolData
 * @description Represents a lending pool in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface IMorphoLendingPoolData extends ILendingPoolData {
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolIdData
}

/**
 * @interface IMorphoLendingPool
 * @description Interface for the implementors of the lending pool
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPool extends IMorphoLendingPoolData, ILendingPool {
  readonly id: IMorphoLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
}

/**
 * @description Zod schema for IMorphoLendingPool
 */
export const MorphoLendingPoolSchema = z.object({
  ...LendingPoolSchema.shape,
  id: MorphoLendingPoolIdSchema,
})

/**
 * @description Type guard for IMorphoLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMorphoLendingPool
 */
export function isMorphoLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMorphoLendingPool {
  return MorphoLendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMorphoLendingPoolData = {} as z.infer<typeof MorphoLendingPoolSchema>
