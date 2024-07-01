import { PositionDataSchema } from '@summerfi/sdk-common'
import { IPosition, ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import { IMorphoBlueLendingPool, MorphoBlueLendingPoolDataSchema } from './IMorphoBlueLendingPool'
import { z } from 'zod'
import { IMorphoBluePositionId, MorphoBluePositionIdDataSchema } from './IMorphoBluePositionId'

/**
 * @interface IMorphoBluePosition
 * @description Represents a position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoBluePosition extends IMorphoBluePositionData, IPosition {
  readonly id: IMorphoBluePositionId
  readonly pool: IMorphoBlueLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoBluePositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  id: MorphoBluePositionIdDataSchema,
  pool: MorphoBlueLendingPoolDataSchema,
})

/**
 * Type for the data part of the IMorphoPosition interface
 */
export type IMorphoBluePositionData = Readonly<z.infer<typeof MorphoBluePositionDataSchema>>

/**
 * @description Type guard for IMorphoPosition
 * @param maybePosition
 * @returns true if the object is an IMorphoPosition
 */
export function isMorphoBluePosition(maybePosition: unknown): maybePosition is IMorphoBluePosition {
  return MorphoBluePositionDataSchema.safeParse(maybePosition).success
}
