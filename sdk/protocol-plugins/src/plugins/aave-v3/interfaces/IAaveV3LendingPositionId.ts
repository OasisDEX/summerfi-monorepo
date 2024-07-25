import { PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPositionId,
  LendingPositionIdDataSchema,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'

/**
 * @interface IAaveV3PositionId
 * @description ID for a position on Aave V3 protocols
 *
 * This interface is used to add all the methods that the interface supports
 *
 */
export interface IAaveV3LendingPositionId extends ILendingPositionId, IAaveV3LendingPositionIdData {
  // Re-declaring the properties with the correct types
  readonly type: PositionType.Lending
}

/**
 * @description Zod schema for IAaveV3PositionId
 */
export const AaveV3PositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
})

/**
 * Type for the data part of IAaveV3PositionId
 */
export type IAaveV3LendingPositionIdData = Readonly<z.infer<typeof AaveV3PositionIdDataSchema>>

/**
 * @description Type guard for IAaveV3PositionId
 * @param maybePositionId
 * @returns true if the object is an IAaveV3PositionId
 */
export function isAaveV3PositionId(
  maybePositionId: unknown,
): maybePositionId is IAaveV3LendingPositionId {
  return AaveV3PositionIdDataSchema.safeParse(maybePositionId).success
}
