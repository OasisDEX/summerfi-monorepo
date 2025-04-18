import { ILendingPoolInfo, LendingPoolInfoDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { isMakerLendingPoolId } from '../../maker/interfaces/IMakerLendingPoolId'
import { IMorphoLendingPoolId } from './IMorphoLendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMorphoLendingPoolInfo
 * @description Represents a lending pool info in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolInfo extends ILendingPoolInfo, IMorphoLendingPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolId
}

/**
 * @description Zod schema for IMorphoLendingPoolInfo
 */
export const MorphoLendingPoolInfoDataSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: z.custom<IMorphoLendingPoolId>((val) => isMakerLendingPoolId(val)),
})

/**
 * Type for the data part of the IMorphoLendingPoolInfo interface
 */
export type IMorphoLendingPoolInfoData = Readonly<z.infer<typeof MorphoLendingPoolInfoDataSchema>>

/**
 * @description Type guard for IMorphoLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IMorphoLendingPoolInfo
 */
export function isMorphoLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IMorphoLendingPoolInfo {
  return MorphoLendingPoolInfoDataSchema.safeParse(maybeLendingPoolInfo).success
}
