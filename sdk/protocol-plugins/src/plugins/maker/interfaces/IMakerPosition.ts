import {
  IPosition,
  IPositionData,
  ITokenAmount,
  PositionDataSchema,
  PositionType,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import {
  IMakerLendingPool,
  IMakerLendingPoolData,
  MakerLendingPoolSchema,
} from './IMakerLendingPool'
import { IMakerPositionId, IMakerPositionIdData, MakerPositionIdSchema } from './IMakerPositionId'

/**
 * @interface IMakerPositionData
 * @description Represents a Maker position
 */
export interface IMakerPositionData extends IPositionData {
  readonly id: IMakerPositionIdData
  readonly pool: IMakerLendingPoolData
}

/**
 * @interface IMakerPosition
 * @description Interface for the implementors of the position
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMakerPosition extends IPosition, IMakerPositionData {
  readonly id: IMakerPositionId
  readonly pool: IMakerLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMakerPositionId
 */
export const MakerPositionSchema = z.object({
  ...PositionDataSchema.shape,
  id: MakerPositionIdSchema,
  pool: MakerLendingPoolSchema,
})

/**
 * @description Type guard for IMakerPosition
 * @param maybeMakerPosition Object to be checked
 * @returns true if the object is a IMakerPosition
 */
export function isMakerPosition(
  maybeMakerPosition: unknown,
): maybeMakerPosition is IMakerPositionData {
  return MakerPositionSchema.safeParse(maybeMakerPosition).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerPositionData = {} as z.infer<typeof MakerPositionSchema>
