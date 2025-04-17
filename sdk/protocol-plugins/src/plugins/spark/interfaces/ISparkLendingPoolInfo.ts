import { ILendingPoolInfo, LendingPoolInfoDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { ISparkLendingPoolId, isSparkLendingPoolId } from './ISparkLendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface ISparkLendingPoolInfo
 * @description Represents a lending pool info in the Spark protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPoolInfo extends ILendingPoolInfo, ISparkLendingPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolId
}

/**
 * @description Zod schema for ISparkLendingPoolInfo
 */
export const SparkLendingPoolInfoDataSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: z.custom<ISparkLendingPoolId>((val) => isSparkLendingPoolId(val)),
})

/**
 * Type for the data part of ISparkLendingPoolInfo
 */
export type ISparkLendingPoolInfoData = Readonly<z.infer<typeof SparkLendingPoolInfoDataSchema>>

/**
 * @description Type guard for ISparkLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an ISparkLendingPoolInfo
 */
export function isSparkLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is ISparkLendingPoolInfo {
  return SparkLendingPoolInfoDataSchema.safeParse(maybeLendingPoolInfo).success
}
