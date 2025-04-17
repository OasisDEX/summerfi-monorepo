import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { IAaveV3LendingPool, isAaveV3LendingPool } from './IAaveV3LendingPool'
import { IAaveV3LendingPositionId, isAaveV3LendingPositionId } from './IAaveV3LendingPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IAaveV3LendingPosition
 * @description Represents a lending position in the Aave V3 protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 *
 */
export interface IAaveV3LendingPosition extends ILendingPosition, IAaveV3LendingPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The pool associated to this position */
  readonly pool: IAaveV3LendingPool
  /** The id of the position */
  readonly id: IAaveV3LendingPositionId

  // Re-declaring the enum type to fix Zod inferrence issue with enums
  readonly subtype: LendingPositionType
}

/**
 * @description Zod schema for IAaveV3PositionId
 */
export const AaveV3LendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  pool: z.custom<IAaveV3LendingPool>((val) => isAaveV3LendingPool(val)),
  id: z.custom<IAaveV3LendingPositionId>((val) => isAaveV3LendingPositionId(val)),
})

/**
 * Type for the data part of the IAaveV3Position interface
 */
export type IAaveV3LendingPositionData = Readonly<z.infer<typeof AaveV3LendingPositionDataSchema>>

/**
 * @description Type guard for IAaveV3Position
 * @param maybePosition
 * @returns true if the object is an IAaveV3Position
 */
export function isAaveV3LendingPosition(
  maybePositionId: unknown,
): maybePositionId is IAaveV3LendingPosition {
  return AaveV3LendingPositionDataSchema.safeParse(maybePositionId).success
}
