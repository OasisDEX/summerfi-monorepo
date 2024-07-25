import { ITokenAmount } from '@summerfi/sdk-common'
import { PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IMakerLendingPool, MakerLendingPoolDataSchema } from './IMakerLendingPool'
import {
  IMakerLendingPositionId,
  MakerLendingPositionIdDataSchema,
} from './IMakerLendingPositionId'

/**
 * @interface IMakerPosition
 * @description Interface for the implementors of the position
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMakerLendingPosition extends ILendingPosition, IMakerLendingPositionData {
  /** ID for the maker position */
  readonly id: IMakerLendingPositionId
  /** Lending pool associated to this position */
  readonly pool: IMakerLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType.Lending
  readonly subtype: LendingPositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMakerLendingPosition
 */
export const MakerLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: MakerLendingPositionIdDataSchema,
  pool: MakerLendingPoolDataSchema,
})

/**
 * Type for the data part of IMakerLendingPosition
 */
export type IMakerLendingPositionData = Readonly<z.infer<typeof MakerLendingPositionDataSchema>>

/**
 * @description Type guard for IMakerLendingPosition
 * @param maybeMakerLendingPosition Object to be checked
 * @returns true if the object is a IMakerLendingPosition
 */
export function isMakerLendingPosition(
  maybeMakerLendingPosition: unknown,
): maybeMakerLendingPosition is IMakerLendingPosition {
  return MakerLendingPositionDataSchema.safeParse(maybeMakerLendingPosition).success
}
