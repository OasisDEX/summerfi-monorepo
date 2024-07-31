import { ITokenAmount } from '@summerfi/sdk-common'
import { PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IMakerLendingPool, isMakerLendingPool } from './IMakerLendingPool'
import { IMakerLendingPositionId, isMakerLendingPositionId } from './IMakerLendingPositionId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMakerLendingPosition
 * @description Interface for the implementors of the position
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMakerLendingPosition extends ILendingPosition, IMakerLendingPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** ID for the maker position */
  readonly id: IMakerLendingPositionId
  /** Lending pool associated to this position */
  readonly pool: IMakerLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly subtype: LendingPositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMakerLendingPosition
 */
export const MakerLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: z.custom<IMakerLendingPositionId>((val) => isMakerLendingPositionId(val)),
  pool: z.custom<IMakerLendingPool>((val) => isMakerLendingPool(val)),
})

/**
 * Type for the parameters of the IMakerLendingPosition interface
 */
export type IMakerLendingPositionParameters = Omit<IMakerLendingPositionData, 'type'>

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
