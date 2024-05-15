import { IPositionId, PositionIdDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface ISparkPositionId
 * @description Represents the ID of a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkPositionId extends IPositionId, ISparkPositionIdData {
  // Empty on purpose
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkPositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
})

/**
 * Type for the data part of ISparkPositionId
 */
export type ISparkPositionIdData = Readonly<z.infer<typeof SparkPositionIdDataSchema>>

/**
 * @description Type guard for ISparkPositionId
 * @param maybePositionId
 * @returns true if the object is an ISparkPositionId
 */
export function isSparkPositionId(maybePositionId: unknown): maybePositionId is ISparkPositionId {
  return SparkPositionIdDataSchema.safeParse(maybePositionId).success
}
