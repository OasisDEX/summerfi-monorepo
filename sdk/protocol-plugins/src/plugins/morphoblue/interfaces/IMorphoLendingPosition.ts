import { ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IMorphoLendingPool, MorphoLendingPoolDataSchema } from './IMorphoLendingPool'
import {
  IMorphoLendingPositionId,
  MorphoLendingPositionIdDataSchema,
} from './IMorphoLendingPositionId'

/**
 * @interface IMorphoLendingPosition
 * @description Represents a lending position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPosition extends ILendingPosition, IMorphoLendingPositionData {
  readonly id: IMorphoLendingPositionId
  readonly pool: IMorphoLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType.Lending
  readonly subtype: LendingPositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: MorphoLendingPositionIdDataSchema,
  pool: MorphoLendingPoolDataSchema,
})

/**
 * Type for the data part of the IMorphoPosition interface
 */
export type IMorphoLendingPositionData = Readonly<z.infer<typeof MorphoLendingPositionDataSchema>>

/**
 * @description Type guard for IMorphoPosition
 * @param maybePosition
 * @returns true if the object is an IMorphoPosition
 */
export function isMorphoLendingPosition(
  maybePosition: unknown,
): maybePosition is IMorphoLendingPosition {
  return MorphoLendingPositionDataSchema.safeParse(maybePosition).success
}
