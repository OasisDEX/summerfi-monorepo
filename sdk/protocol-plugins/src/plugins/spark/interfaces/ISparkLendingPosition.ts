import { ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { ISparkLendingPool, isSparkLendingPool } from './ISparkLendingPool'
import { ISparkLendingPositionId, isSparkLendingPositionId } from './ISparkLendingPositionId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __isparklendingposition__: unique symbol = Symbol()

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
  readonly [__isparklendingposition__]: 'ISparkLendingPosition'
  /** Specific ID of the position for Spark */
  readonly id: ISparkLendingPositionId
  /** Pool where the position is */
  readonly pool: ISparkLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly subtype: LendingPositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
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
 * Type for the parameters of the ISparkPosition interface
 */
export type ISparkLendingPositionParameters = Omit<ISparkLendingPositionData, 'type'>

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
