import { PositionSchema } from '@summerfi/sdk-common'
import {
  IPosition,
  IPositionData,
  IPositionId,
  ITokenAmount,
  PositionType,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'
import {
  ISparkLendingPool,
  ISparkLendingPoolData,
  SparkLendingPoolSchema,
} from './ISparkLendingPool'

/**
 * @interface ISparkPositionData
 * @description Represents a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkPositionData extends IPositionData {
  readonly pool: ISparkLendingPoolData
}

/**
 * @interface ISparkPosition
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkPosition extends ISparkPositionData, IPosition {
  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly id: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: ISparkLendingPool
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkPositionSchema = z.object({
  ...PositionSchema.shape,
  pool: SparkLendingPoolSchema,
})

/**
 * @description Type guard for ISparkPosition
 * @param maybePosition
 * @returns true if the object is an ISparkPosition
 */
export function isSparkPosition(maybePosition: unknown): maybePosition is ISparkPositionData {
  return SparkPositionSchema.safeParse(maybePosition).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkPositionData = {} as z.infer<typeof SparkPositionSchema>
