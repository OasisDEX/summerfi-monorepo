import { IPositionId, PositionIdDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IAaveV3PositionId
 * @description ID for a position on Aave V3 protocols
 *
 * This interface is used to add all the methods that the interface supports
 *
 */
export interface IAaveV3PositionId extends IPositionId, IAaveV3PositionIdData {
  // Empty on purpose
}

/**
 * @description Zod schema for IAaveV3PositionId
 */
export const AaveV3PositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
})

/**
 * Type for the data part of IAaveV3PositionId
 */
export type IAaveV3PositionIdData = Readonly<z.infer<typeof AaveV3PositionIdDataSchema>>

/**
 * @description Type guard for IAaveV3PositionId
 * @param maybePositionId
 * @returns true if the object is an IAaveV3PositionId
 */
export function isAaveV3PositionId(maybePositionId: unknown): maybePositionId is IAaveV3PositionId {
  return AaveV3PositionIdDataSchema.safeParse(maybePositionId).success
}
