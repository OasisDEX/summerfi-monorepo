import { ITokenAmount, PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
  LendingPositionType,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IMorphoLendingPool, isMorphoLendingPool } from './IMorphoLendingPool'
import { IMorphoLendingPositionId, isMorphoLendingPositionId } from './IMorphoLendingPositionId'

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
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IMorphoLendingPosition'
  /** The position's ID */
  readonly id: IMorphoLendingPositionId
  /** The pool the position belongs to */
  readonly pool: IMorphoLendingPool

  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly subtype: LendingPositionType
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: z.custom<IMorphoLendingPositionId>((val) => isMorphoLendingPositionId(val)),
  pool: z.custom<IMorphoLendingPool>((val) => isMorphoLendingPool(val)),
})

/**
 * Type for the data part of the IMorphoPosition interface
 */
export type IMorphoLendingPositionData = Readonly<z.infer<typeof MorphoLendingPositionDataSchema>>

/**
 * Type for the parameters of the IMorphoPosition interface
 */
export type IMorphoLendingPositionParameters = Omit<IMorphoLendingPositionData, 'type'>

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