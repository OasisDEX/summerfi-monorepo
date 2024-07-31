import { ICollateralInfo, IDebtInfo } from '@summerfi/sdk-common'
import { PoolType } from '@summerfi/sdk-common/common'
import { ILendingPoolInfo, LendingPoolInfoDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { ISparkLendingPoolId, isSparkLendingPoolId } from './ISparkLendingPoolId'

/**
 * @interface ISparkLendingPoolInfo
 * @description Represents a lending pool info in the Spark protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPoolInfo extends ILendingPoolInfo, ISparkLendingPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'ISparkLendingPoolInfo'
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
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
 * Type for the parameters of the ISparkLendingPoolInfo interface
 */
export type ISparkLendingPoolInfoParameters = Omit<ISparkLendingPoolInfoData, 'type'>

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
