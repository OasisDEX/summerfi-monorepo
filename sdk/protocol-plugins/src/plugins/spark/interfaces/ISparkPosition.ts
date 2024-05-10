import { PositionDataSchema } from '@summerfi/sdk-common'
import { IPosition, ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { ISparkLendingPool, SparkLendingPoolDataSchema } from './ISparkLendingPool'
import { ISparkPositionId } from './ISparkPositionId'

/**
 * @interface ISparkPosition
 * @description Represents a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkPosition extends ISparkPositionData, IPosition {
  /** Specific ID of the position for Spark */
  readonly id: ISparkPositionId
  /** Pool where the position is */
  readonly pool: ISparkLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkPositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  pool: SparkLendingPoolDataSchema,
})

/**
 * Type for the data part of ISparkPosition
 */
export type ISparkPositionData = Readonly<z.infer<typeof SparkPositionDataSchema>>

/**
 * @description Type guard for ISparkPosition
 * @param maybePosition
 * @returns true if the object is an ISparkPosition
 */
export function isSparkPosition(maybePosition: unknown): maybePosition is ISparkPosition {
  return SparkPositionDataSchema.safeParse(maybePosition).success
}
