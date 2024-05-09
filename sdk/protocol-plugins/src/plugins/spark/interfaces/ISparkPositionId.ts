import { IPositionId, IPositionIdData, PositionIdDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface ISparkPositionIdData
 * @description Represents the ID of a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkPositionIdData extends IPositionIdData {
  // Empty on purpose
}

/**
 * @interface ISparkPositionId
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ISparkPositionId extends IPositionId, ISparkPositionIdData {
  // Empty on purpose
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkPositionIdSchema = z.object({
  ...PositionIdDataSchema.shape,
})

/**
 * @description Type guard for ISparkPositionId
 * @param maybePositionId
 * @returns true if the object is an ISparkPositionId
 */
export function isSparkPositionId(
  maybePositionId: unknown,
): maybePositionId is ISparkPositionIdData {
  return SparkPositionIdSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkPositionIdData = {} as z.infer<typeof SparkPositionIdSchema>
