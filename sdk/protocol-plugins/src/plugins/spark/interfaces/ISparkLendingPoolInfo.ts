import {
  ILendingPoolInfo,
  ILendingPoolInfoData,
  LendingPoolInfoDataSchema,
} from '@summerfi/sdk-common/protocols'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  SparkLendingPoolIdSchema,
} from './ISparkLendingPoolId'
import { z } from 'zod'
import { ICollateralInfo, IDebtInfo } from '@summerfi/sdk-common'

/**
 * @interface ISparkLendingPoolInfoData
 * @description Represents a lending pool info in the Spark protocol
 */
export interface ISparkLendingPoolInfoData extends ILendingPoolInfoData {
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolIdData
}

/**
 * @interface ISparkLendingPoolInfo
 * @description Interface for the implementors of the lending pool info
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPoolInfo extends ILendingPoolInfo, ISparkLendingPoolInfoData {
  readonly id: ISparkLendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for ISparkLendingPoolInfo
 */
export const SparkLendingPoolInfoSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: SparkLendingPoolIdSchema,
})

/**
 * @description Type guard for ISparkLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an ISparkLendingPoolInfo
 */
export function isSparkLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is ISparkLendingPoolInfoData {
  return SparkLendingPoolInfoSchema.safeParse(maybeLendingPoolInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkLendingPoolInfoData = {} as z.infer<typeof SparkLendingPoolInfoSchema>
