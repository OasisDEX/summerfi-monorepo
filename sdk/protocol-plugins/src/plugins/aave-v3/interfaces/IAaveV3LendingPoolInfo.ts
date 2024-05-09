import {
  ICollateralInfo,
  IDebtInfo,
  ILendingPoolInfo,
  ILendingPoolInfoData,
  LendingPoolInfoDataSchema,
} from '@summerfi/sdk-common/protocols'
import { z } from 'zod'
import {
  AaveV3LendingPoolIdSchema,
  IAaveV3LendingPoolId,
  IAaveV3LendingPoolIdData,
} from './IAaveV3LendingPoolId'

/**
 * @interface IAaveV3LendingPoolInfoData
 * @description Represents a lending pool info in the Aave V3 protocol
 */
export interface IAaveV3LendingPoolInfoData extends ILendingPoolInfoData {
  /** The lending pool's ID */
  readonly id: IAaveV3LendingPoolIdData
}

/**
 * @interface IAaveV3LendingPoolInfo
 * @description Interface for the implementors of the lending pool info
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3LendingPoolInfo extends ILendingPoolInfo, IAaveV3LendingPoolInfoData {
  readonly id: IAaveV3LendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for IAaveV3LendingPool
 */
export const AaveV3LendingPoolInfoSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: AaveV3LendingPoolIdSchema,
})

/**
 * @description Type guard for IAaveV3LendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IAaveV3LendingPoolInfo
 */
export function isAaveV3LendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IAaveV3LendingPoolInfoData {
  return AaveV3LendingPoolInfoSchema.safeParse(maybeLendingPoolInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3LendingPoolInfoData = {} as z.infer<
  typeof AaveV3LendingPoolInfoSchema
>
