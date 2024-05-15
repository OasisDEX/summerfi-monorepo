import { IPosition, ITokenAmount, PositionDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { AaveV3LendingPoolDataSchema, IAaveV3LendingPool } from './IAaveV3LendingPool'
import { IAaveV3PositionId } from './IAaveV3PositionId'
import { PositionType } from '@summerfi/sdk-common'

/**
 * @interface IAaveV3Position
 * @description Represents a position in the Aave V3 protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 *
 */
export interface IAaveV3Position extends IPosition, IAaveV3PositionData {
  /** The pool associated to this position */
  readonly pool: IAaveV3LendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly id: IAaveV3PositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IAaveV3PositionId
 */
export const AaveV3PositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  pool: AaveV3LendingPoolDataSchema,
})

/**
 * Type for the data part of the IAaveV3Position interface
 */
export type IAaveV3PositionData = Readonly<z.infer<typeof AaveV3PositionDataSchema>>

/**
 * @description Type guard for IAaveV3Position
 * @param maybePosition
 * @returns true if the object is an IAaveV3Position
 */
export function isAaveV3Position(maybePositionId: unknown): maybePositionId is IAaveV3Position {
  return AaveV3PositionDataSchema.safeParse(maybePositionId).success
}
