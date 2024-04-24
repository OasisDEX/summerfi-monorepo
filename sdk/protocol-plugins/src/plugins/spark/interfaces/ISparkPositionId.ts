import { IPositionId, PositionIdSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface ISparkPositionId
 * @description Represents a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkPositionId extends IPositionId {
  // Empty on purpose
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkPositionIdSchema = z.object({
  ...PositionIdSchema.shape,
})

/**
 * @description Type guard for ISparkPositionId
 * @param maybePositionId
 * @returns true if the object is an ISparkPositionId
 */
export function isSparkPositionId(maybePositionId: unknown): maybePositionId is ISparkPositionId {
  return SparkPositionIdSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkPositionId = {} as z.infer<typeof SparkPositionIdSchema>
