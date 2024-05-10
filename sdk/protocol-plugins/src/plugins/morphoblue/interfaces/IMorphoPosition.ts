import { PositionDataSchema } from '@summerfi/sdk-common'
import { IPosition, IPositionId, ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import { IMorphoLendingPool, MorphoLendingPoolDataSchema } from './IMorphoLendingPool'
import { z } from 'zod'

/**
 * @interface IMorphoPosition
 * @description Represents a position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoPosition extends IMorphoPositionData, IPosition {
  /** Lending pool associated to this position */
  readonly pool: IMorphoLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly id: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoPositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  pool: MorphoLendingPoolDataSchema,
})

/**
 * Type for the data part of the IMorphoPosition interface
 */
export type IMorphoPositionData = Readonly<z.infer<typeof MorphoPositionDataSchema>>

/**
 * @description Type guard for IMorphoPosition
 * @param maybePosition
 * @returns true if the object is an IMorphoPosition
 */
export function isMorphoPosition(maybePosition: unknown): maybePosition is IMorphoPosition {
  return MorphoPositionDataSchema.safeParse(maybePosition).success
}
