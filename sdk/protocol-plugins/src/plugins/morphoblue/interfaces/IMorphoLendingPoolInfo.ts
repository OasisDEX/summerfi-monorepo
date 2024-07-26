import { ICollateralInfo, IDebtInfo, PoolType } from '@summerfi/sdk-common'
import { ILendingPoolInfo, LendingPoolInfoDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { isMakerLendingPoolId } from '../../maker'
import { IMorphoLendingPoolId } from './IMorphoLendingPoolId'

/**
 * @interface IMorphoLendingPoolInfo
 * @description Represents a lending pool info in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolInfo extends ILendingPoolInfo, IMorphoLendingPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IMorphoLendingPoolInfo'
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
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
 * Type for the parameters of the IMorphoLendingPoolInfo interface
 */
export type IMorphoLendingPoolInfoParameters = Omit<IMorphoLendingPoolInfoData, 'type'>

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
