import {
  ICollateralInfo,
  IDebtInfo,
  ILendingPoolInfo,
  ILendingPoolInfoData,
  LendingPoolInfoDataSchema,
} from '@summerfi/sdk-common/protocols'
import {
  IMakerLendingPoolId,
  IMakerLendingPoolIdData,
  MakerLendingPoolIdSchema,
} from './IMakerLendingPoolId'
import { z } from 'zod'

/**
 * @interface IMakerLendingPoolInfoData
 * @description Represents a lending pool info in the Maker protocol
 */
export interface IMakerLendingPoolInfoData extends ILendingPoolInfoData {
  /** The pool's ID */
  readonly id: IMakerLendingPoolIdData
}

/**
 * @interface IMakerLendingPoolInfo
 * @description Interface for the implementors of the lending pool info
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerLendingPoolInfo extends ILendingPoolInfo, IMakerLendingPoolInfoData {
  readonly id: IMakerLendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for IMakerLendingPool
 */
export const MakerLendingPoolInfoSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: MakerLendingPoolIdSchema,
})

/**
 * @description Type guard for IMakerLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IMakerLendingPoolInfo
 */
export function isMakerLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IMakerLendingPoolInfoData {
  return MakerLendingPoolInfoSchema.safeParse(maybeLendingPoolInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerLendingPoolInfoData = {} as z.infer<typeof MakerLendingPoolInfoSchema>
