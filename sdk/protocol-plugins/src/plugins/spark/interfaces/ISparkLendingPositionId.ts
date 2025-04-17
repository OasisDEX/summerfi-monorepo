import { ILendingPositionId, LendingPositionIdDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface ISparkPositionId
 * @description Represents the ID of a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkLendingPositionId extends ILendingPositionId, ISparkLendingPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkLendingPositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
})

/**
 * Type for the data part of ISparkPositionId
 */
export type ISparkLendingPositionIdData = Readonly<z.infer<typeof SparkLendingPositionIdDataSchema>>

/**
 * @description Type guard for ISparkPositionId
 * @param maybeSparkLendingPositionId
 * @returns true if the object is an ISparkPositionId
 */
export function isSparkLendingPositionId(
  maybeSparkLendingPositionId: unknown,
): maybeSparkLendingPositionId is ISparkLendingPositionId {
  return SparkLendingPositionIdDataSchema.safeParse(maybeSparkLendingPositionId).success
}
