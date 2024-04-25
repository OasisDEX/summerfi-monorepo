import { IPositionId, IPositionIdData, PositionIdSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IAaveV3PositionIdData
 * @see IPositionId
 */
export interface IAaveV3PositionIdData extends IPositionIdData {
  // Empty on purpose
}

/**
 * @interface IAaveV3PositionId
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IAaveV3PositionId extends IPositionId {
  // Empty on purpose
}

/**
 * @description Zod schema for IAaveV3PositionId
 */
export const AaveV3PositionIdSchema = z.object({
  ...PositionIdSchema.shape,
})

/**
 * @description Type guard for IAaveV3PositionId
 * @param maybePositionId
 * @returns true if the object is an IAaveV3PositionId
 */
export function isAaveV3PositionId(
  maybePositionId: unknown,
): maybePositionId is IAaveV3PositionIdData {
  return AaveV3PositionIdSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3PositionIdData = {} as z.infer<typeof AaveV3PositionIdSchema>
