import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { ISparkLendingPool, isSparkLendingPool } from './ISparkLendingPool'
import { ISparkLendingPositionId, isSparkLendingPositionId } from './ISparkLendingPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface ISparkPosition
 * @description Represents a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPosition extends ILendingPosition, ISparkLendingPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Specific ID of the position for Spark */
  readonly id: ISparkLendingPositionId
  /** Pool where the position is */
  readonly pool: ISparkLendingPool

  // Re-declaring the properties to narrow the types
  readonly subtype: LendingPositionType
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: z.custom<ISparkLendingPositionId>((val) => isSparkLendingPositionId(val)),
  pool: z.custom<ISparkLendingPool>((val) => isSparkLendingPool(val)),
})

/**
 * Type for the data part of ISparkPosition
 */
export type ISparkLendingPositionData = Readonly<z.infer<typeof SparkLendingPositionDataSchema>>

/**
 * @description Type guard for ISparkPosition
 * @param maybePosition
 * @returns true if the object is an ISparkPosition
 */
export function isSparkLendingPosition(
  maybePosition: unknown,
): maybePosition is ISparkLendingPosition {
  return SparkLendingPositionDataSchema.safeParse(maybePosition).success
}
