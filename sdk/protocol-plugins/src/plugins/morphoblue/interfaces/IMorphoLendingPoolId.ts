import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/protocols'
import { IMorphoProtocol, MorphoProtocolDataSchema } from './IMorphoProtocol'
import { HexData } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMorphoLendingPoolId
 * @description Identifier of a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolId extends IMorphoLendingPoolIdData, ILendingPoolId {
  /** The protocol to which the pool belongs */
  readonly protocol: IMorphoProtocol
  /** The encoded market ID used to access the market parameters */
  readonly marketId: HexData
}

/**
 * @description Zod schema for IMorphoLendingPoolId
 */
export const MorphoLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: MorphoProtocolDataSchema,
  marketId: z.custom<HexData>(),
})

/**
 * Type for the data part of the IMorphoLendingPoolId interface
 */
export type IMorphoLendingPoolIdData = Readonly<z.infer<typeof MorphoLendingPoolIdDataSchema>>

/**
 * @description Type guard for IMorphoLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an IMorphoLendingPoolId
 */
export function isMorphoLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is IMorphoLendingPoolIdData {
  return MorphoLendingPoolIdDataSchema.safeParse(maybeLendingPoolId).success
}
