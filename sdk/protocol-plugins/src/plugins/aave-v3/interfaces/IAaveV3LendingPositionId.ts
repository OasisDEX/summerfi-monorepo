import { ILendingPositionId, LendingPositionIdDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IAaveV3LendingPositionId
 * @description ID for a position on Aave V3 protocols
 *
 * This interface is used to add all the methods that the interface supports
 *
 */
export interface IAaveV3LendingPositionId extends ILendingPositionId, IAaveV3LendingPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
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
 * @description Type guard for IAaveV3LendingPositionId
 * @param maybePositionId
 * @returns true if the object is an IAaveV3LendingPositionId
 */
export function isAaveV3LendingPositionId(
  maybePositionId: unknown,
): maybePositionId is IAaveV3LendingPositionId {
  return AaveV3PositionIdDataSchema.safeParse(maybePositionId).success
}
