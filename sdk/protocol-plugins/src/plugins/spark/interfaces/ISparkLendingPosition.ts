import { ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { ISparkLendingPool, SparkLendingPoolDataSchema } from './ISparkLendingPool'
import {
  ISparkLendingPositionId,
  SparkLendingPositionIdDataSchema,
} from './ISparkLendingPositionId'

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
  /** Specific ID of the position for Spark */
  readonly id: ISparkLendingPositionId
  /** Pool where the position is */
  readonly pool: ISparkLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType.Lending
  readonly subtype: LendingPositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: SparkLendingPositionIdDataSchema,
  pool: SparkLendingPoolDataSchema,
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
