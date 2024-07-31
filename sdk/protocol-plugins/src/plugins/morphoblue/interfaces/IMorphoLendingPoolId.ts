import { HexData, PoolType } from '@summerfi/sdk-common'
import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { isHex } from 'viem'
import { z } from 'zod'
import { IMorphoProtocol, isMorphoProtocol } from './IMorphoProtocol'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMorphoLendingPoolId
 * @description Identifier of a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolId extends IMorphoLendingPoolIdData, ILendingPoolId {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The protocol to which the pool belongs */
  readonly protocol: IMorphoProtocol
  /** The encoded market ID used to access the market parameters */
  readonly marketId: HexData

  // Re-declaring the properties with the correct types
  readonly type: PoolType
}

/**
 * @description Zod schema for IMorphoLendingPoolId
 */
export const MorphoLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: z.custom<IMorphoProtocol>((val) => isMorphoProtocol(val)),
  marketId: z.custom<HexData>((val) => isHex(val)),
})

/**
 * Type for the data part of the IMorphoLendingPoolId interface
 */
export type IMorphoLendingPoolIdData = Readonly<z.infer<typeof MorphoLendingPoolIdDataSchema>>

/**
 * Type for the parameters of the IMorphoLendingPoolId interface
 */
export type IMorphoLendingPoolIdParameters = Omit<IMorphoLendingPoolIdData, 'type'>

/**
 * @description Type guard for IMorphoLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an IMorphoLendingPoolId
 */
export function isMorphoLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is IMorphoLendingPoolId {
  return MorphoLendingPoolIdDataSchema.safeParse(maybeLendingPoolId).success
}
