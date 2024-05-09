import { LendingPoolDataSchema } from '@summerfi/sdk-common/protocols'
import { IMorphoLendingPoolId, MorphoLendingPoolIdDataSchema } from './IMorphoLendingPoolId'
import { ILendingPool, PoolType } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMorphoLendingPool
 * @description Represents a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPool extends IMorphoLendingPoolData, ILendingPool {
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
}

/**
 * @description Zod schema for IMorphoLendingPool
 */
export const MorphoLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: MorphoLendingPoolIdDataSchema,
})

/**
 * Type for the data part of the IMorphoLendingPool interface
 */
export type IMorphoLendingPoolData = Readonly<z.infer<typeof MorphoLendingPoolDataSchema>>

/**
 * @description Type guard for IMorphoLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMorphoLendingPool
 */
export function isMorphoLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMorphoLendingPool {
  return MorphoLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
