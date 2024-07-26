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
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IAaveV3LendingPositionId'

  // Re-declaring the properties with the correct types
  readonly type: PositionType
}

/**
 * @description Zod schema for IAaveV3LendingPositionId
 */
export const AaveV3PositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
})

/**
 * Type for the data part of IAaveV3LendingPositionId
 */
export type IAaveV3LendingPositionIdData = Readonly<z.infer<typeof AaveV3PositionIdDataSchema>>

/**
 * Type for the parameters of the IAaveV3PositionId interface
 */
export type IAaveV3LendingPositionIdParameters = Omit<IAaveV3LendingPositionIdData, 'type'>

/**
 * @description Type guard for IAaveV3LendingPositionId
 * @param maybePositionId
 * @returns true if the object is an IAaveV3LendingPositionId
 */
export function isAaveV3LendingPositionId(
  maybePositionId: unknown,
): maybePositionId is IAaveV3LendingPositionId {
  return AaveV3PositionIdDataSchema.safeParse(maybePositionId).success
}
