import {
  ILendingPoolInfo,
  ILendingPoolInfoData,
  LendingPoolInfoSchema,
} from '@summerfi/sdk-common/protocols'
import {
  IMorphoLendingPoolId,
  IMorphoLendingPoolIdData,
  MorphoLendingPoolIdSchema,
} from './IMorphoLendingPoolId'
import { z } from 'zod'
import { ICollateralInfo, IDebtInfo } from '@summerfi/sdk-common'

/**
 * @interface IMorphoLendingPoolInfoData
 * @description Represents a lending pool info in the Morpho protocol
 */
export interface IMorphoLendingPoolInfoData extends ILendingPoolInfoData {
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolIdData
}

/**
 * @interface IMorphoLendingPoolInfo
 * @description Interface for the implementors of the lending pool info
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolInfo extends ILendingPoolInfo, IMorphoLendingPoolInfoData {
  readonly id: IMorphoLendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for IMorphoLendingPoolInfo
 */
export const MorphoLendingPoolInfoSchema = z.object({
  ...LendingPoolInfoSchema.shape,
  id: MorphoLendingPoolIdSchema,
})

/**
 * @description Type guard for IMorphoLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IMorphoLendingPoolInfo
 */
export function isMorphoLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IMorphoLendingPoolInfoData {
  return MorphoLendingPoolInfoSchema.safeParse(maybeLendingPoolInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMorphoLendingPoolInfoData = {} as z.infer<
  typeof MorphoLendingPoolInfoSchema
>
