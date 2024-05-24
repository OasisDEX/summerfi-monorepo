import { ILendingPoolInfo, LendingPoolInfoDataSchema } from '@summerfi/sdk-common/protocols'
import {
  IMorphoBlueLendingPoolId,
  MorphoBlueLendingPoolIdDataSchema,
} from './IMorphoBlueLendingPoolId'
import { z } from 'zod'
import { ICollateralInfo, IDebtInfo } from '@summerfi/sdk-common'

/**
 * @interface IMorphoBlueLendingPoolInfo
 * @description Represents a lending pool info in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoBlueLendingPoolInfo
  extends ILendingPoolInfo,
    IMorphoBlueLendingPoolInfoData {
  /** The id of the lending pool */
  readonly id: IMorphoBlueLendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for IMorphoLendingPoolInfo
 */
export const MorphoBlueLendingPoolInfoDataSchema = z.object({
  ...LendingPoolInfoDataSchema.shape,
  id: MorphoBlueLendingPoolIdDataSchema,
})

/**
 * Type for the data part of the IMorphoLendingPoolInfo interface
 */
export type IMorphoBlueLendingPoolInfoData = Readonly<
  z.infer<typeof MorphoBlueLendingPoolInfoDataSchema>
>

/**
 * @description Type guard for IMorphoLendingPoolInfo
 * @param maybeLendingPoolInfo
 * @returns true if the object is an IMorphoLendingPoolInfo
 */
export function isMorphoBlueLendingPoolInfo(
  maybeLendingPoolInfo: unknown,
): maybeLendingPoolInfo is IMorphoBlueLendingPoolInfo {
  return MorphoBlueLendingPoolInfoDataSchema.safeParse(maybeLendingPoolInfo).success
}
