import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { ISparkLendingPoolId, isSparkLendingPoolId } from './ISparkLendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface ISparkLendingPool
 * @description Represents a lending pool in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPool extends ISparkLendingPoolData, ILendingPool {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolId
}

/**
 * @description Zod schema for ISparkLendingPool
 */
export const SparkLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: z.custom<ISparkLendingPoolId>((val) => isSparkLendingPoolId(val)),
})

/**
 * Type for the data part of ISparkLendingPool
 */
export type ISparkLendingPoolData = Readonly<z.infer<typeof SparkLendingPoolDataSchema>>

/**
 * @description Type guard for ISparkLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an ISparkLendingPool
 */
export function isSparkLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is ISparkLendingPool {
  return SparkLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
