import { IPosition, ITokenAmount, PositionDataSchema, PositionType } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IMakerLendingPool, MakerLendingPoolDataSchema } from './IMakerLendingPool'
import { IMakerPositionId, MakerPositionIdDataSchema } from './IMakerPositionId'

/**
 * @interface IMakerPosition
 * @description Interface for the implementors of the position
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMakerPosition extends IPosition, IMakerPositionData {
  /** ID for the maker position */
  readonly id: IMakerPositionId
  /** Lending pool associated to this position */
  readonly pool: IMakerLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMakerPositionId
 */
export const MakerPositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  id: MakerPositionIdDataSchema,
  pool: MakerLendingPoolDataSchema,
})

/**
 * Type for the data part of IMakerPosition
 */
export type IMakerPositionData = Readonly<z.infer<typeof MakerPositionDataSchema>>

/**
 * @description Type guard for IMakerPosition
 * @param maybeMakerPosition Object to be checked
 * @returns true if the object is a IMakerPosition
 */
export function isMakerPosition(maybeMakerPosition: unknown): maybeMakerPosition is IMakerPosition {
  return MakerPositionDataSchema.safeParse(maybeMakerPosition).success
}
