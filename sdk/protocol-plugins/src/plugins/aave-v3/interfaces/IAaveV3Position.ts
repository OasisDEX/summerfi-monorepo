import { IPosition, IPositionData, ITokenAmount, PositionSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import {
  AaveV3LendingPoolSchema,
  IAaveV3LendingPool,
  IAaveV3LendingPoolData,
} from './IAaveV3LendingPool'

/**
 * @interface IAaveV3PositionData
 * @description Represents a position in the Aave V3 protocol
 */
export interface IAaveV3PositionData extends IPositionData {
  readonly pool: IAaveV3LendingPoolData
}

/**
 * @interface IAaveV3Position
 * @description Interface for the implementors of the position
 *
 * This interface is used to add all the methods that the interface supports
 *
 */
export interface IAaveV3Position extends IPosition, IAaveV3PositionData {
  readonly pool: IAaveV3LendingPool

  // Empty on purpose
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IAaveV3PositionId
 */
export const AaveV3PositionSchema = z.object({
  ...PositionSchema.shape,
  pool: AaveV3LendingPoolSchema,
})

/**
 * @description Type guard for IAaveV3Position
 * @param maybePosition
 * @returns true if the object is an IAaveV3Position
 */
export function isAaveV3Position(maybePositionId: unknown): maybePositionId is IAaveV3PositionData {
  return AaveV3PositionSchema.safeParse(maybePositionId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3PositionData = {} as z.infer<typeof AaveV3PositionSchema>
