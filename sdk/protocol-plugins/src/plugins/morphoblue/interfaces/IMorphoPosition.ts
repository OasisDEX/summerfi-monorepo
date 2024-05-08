import { PositionSchema } from '@summerfi/sdk-common'
import {
  IPosition,
  IPositionData,
  IPositionId,
  ITokenAmount,
  PositionType,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'
import {
  IMorphoLendingPool,
  IMorphoLendingPoolData,
  MorphoLendingPoolSchema,
} from './IMorphoLendingPool'

/**
 * @interface IMorphoPositionData
 * @description Represents a position in the Morpho protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface IMorphoPositionData extends IPositionData {
  readonly pool: IMorphoLendingPoolData
}

/**
 * @interface IMorphoPosition
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoPosition extends IMorphoPositionData, IPosition {
  // Re-declaring the properties with the correct types
  readonly type: PositionType
  readonly id: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  readonly pool: IMorphoLendingPool
}

/**
 * @description Zod schema for IMorphoPositionId
 */
export const MorphoPositionSchema = z.object({
  ...PositionSchema.shape,
  pool: MorphoLendingPoolSchema,
})

/**
 * @description Type guard for IMorphoPosition
 * @param maybePosition
 * @returns true if the object is an IMorphoPosition
 */
export function isMorphoPosition(maybePosition: unknown): maybePosition is IMorphoPositionData {
  return MorphoPositionSchema.safeParse(maybePosition).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMorphoPositionData = {} as z.infer<typeof MorphoPositionSchema>
