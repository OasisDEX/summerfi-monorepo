import { IPositionId, PositionIdSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IAaveV3PositionId
 * @see IPositionId
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
export function isAaveV3PositionId(maybePositionId: unknown): maybePositionId is IAaveV3PositionId {
  return AaveV3PositionIdSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3PositionId = {} as z.infer<typeof AaveV3PositionIdSchema>
