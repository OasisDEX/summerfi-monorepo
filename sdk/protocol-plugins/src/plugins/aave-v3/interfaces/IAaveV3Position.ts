import {
  IPosition,
  IPositionData,
  ITokenAmount,
  PositionDataSchema,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'
import {
  AaveV3LendingPoolSchema,
  IAaveV3LendingPool,
  IAaveV3LendingPoolData,
} from './IAaveV3LendingPool'
import { IAaveV3PositionId } from './IAaveV3PositionId'
import { PositionType } from '@summerfi/sdk-common'

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
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 *
 */
export interface IAaveV3Position extends IPosition, IAaveV3PositionData {
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
export const AaveV3PositionSchema = z.object({
  ...PositionDataSchema.shape,
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
