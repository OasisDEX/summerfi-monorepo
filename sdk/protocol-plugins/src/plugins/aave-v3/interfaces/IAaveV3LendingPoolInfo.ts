import { ILendingPoolInfo, LendingPoolInfoDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IAaveV3LendingPoolId, isAaveV3LendingPoolId } from './IAaveV3LendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IAaveV3LendingPoolInfo
 * @description Represents a lending pool info in the Aave V3 protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3LendingPoolInfo extends ILendingPoolInfo, IAaveV3LendingPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The lending pool's ID */
  readonly id: IAaveV3LendingPoolId
}

/**
 * @description Zod schema for IAaveV3LendingPool
 */
export const AaveV3LendingPoolInfoDataSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: z.custom<IAaveV3LendingPoolId>((val) => isAaveV3LendingPoolId(val)),
})

/**
 * Type for the data part of IAaveV3LendingPool
 */
export type IAaveV3LendingPoolInfoData = Readonly<z.infer<typeof AaveV3LendingPoolInfoDataSchema>>

/**
 * @description Type guard for IAaveV3LendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IAaveV3LendingPoolInfo
 */
export function isAaveV3LendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IAaveV3LendingPoolInfo {
  return AaveV3LendingPoolInfoDataSchema.safeParse(maybeLendingPoolInfo).success
}
