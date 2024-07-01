import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/protocols'
import { IMorphoBlueProtocol, MorphoBlueProtocolDataSchema } from './IMorphoBlueProtocol'
import { HexData } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMorphoBlueLendingPoolId
 * @description Identifier of a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoBlueLendingPoolId extends IMorphoBlueLendingPoolIdData, ILendingPoolId {
  /** The protocol to which the pool belongs */
  readonly protocol: IMorphoBlueProtocol
  /** The encoded market ID used to access the market parameters */
  readonly marketId: HexData
}

/**
 * @description Zod schema for IMorphoLendingPoolId
 */
export const MorphoBlueLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: MorphoBlueProtocolDataSchema,
  marketId: z.custom<HexData>(),
})

/**
 * Type for the data part of the IMorphoLendingPoolId interface
 */
export type IMorphoBlueLendingPoolIdData = Readonly<
  z.infer<typeof MorphoBlueLendingPoolIdDataSchema>
>

/**
 * @description Type guard for IMorphoLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an IMorphoLendingPoolId
 */
export function isMorphoBlueLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is IMorphoBlueLendingPoolId {
  return MorphoBlueLendingPoolIdDataSchema.safeParse(maybeLendingPoolId).success
}
