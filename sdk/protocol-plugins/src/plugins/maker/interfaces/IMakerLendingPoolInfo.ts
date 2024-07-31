import { PoolType } from '@summerfi/sdk-common'
import {
  ICollateralInfo,
  IDebtInfo,
  ILendingPoolInfo,
  LendingPoolInfoDataSchema,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IMakerLendingPoolId, isMakerLendingPoolId } from './IMakerLendingPoolId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMakerLendingPoolInfo
 * @description Represents a lending pool info in the Maker protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerLendingPoolInfo extends ILendingPoolInfo, IMakerLendingPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The pool's ID */
  readonly id: IMakerLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for IMakerLendingPool
 */
export const MakerLendingPoolInfoDataSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: z.custom<IMakerLendingPoolId>((val) => isMakerLendingPoolId(val)),
})

/**
 * Type for the data part of IMakerLendingPool
 */
export type IMakerLendingPoolInfoData = Readonly<z.infer<typeof MakerLendingPoolInfoDataSchema>>

/**
 * Type for the parameters of the IMakerLendingPool interface
 */
export type IMakerLendingPoolInfoParameters = Omit<IMakerLendingPoolInfoData, 'type'>

/**
 * @description Type guard for IMakerLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IMakerLendingPoolInfo
 */
export function isMakerLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IMakerLendingPoolInfo {
  return MakerLendingPoolInfoDataSchema.safeParse(maybeLendingPoolInfo).success
}
