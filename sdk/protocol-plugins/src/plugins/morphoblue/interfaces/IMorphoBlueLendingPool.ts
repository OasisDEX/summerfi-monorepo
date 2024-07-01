import { LendingPoolDataSchema } from '@summerfi/sdk-common/protocols'
import {
  IMorphoBlueLendingPoolId,
  MorphoBlueLendingPoolIdDataSchema,
} from './IMorphoBlueLendingPoolId'
import {
  ILendingPool,
  IRiskRatio,
  IToken,
  PoolType,
  RiskRatioDataSchema,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { AddressDataSchema, IAddress } from '@summerfi/sdk-common/common'

/**
 * @interface IMorphoBlueLendingPool
 * @description Represents a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoBlueLendingPool extends IMorphoBlueLendingPoolData, ILendingPool {
  /** The id of the lending pool */
  readonly id: IMorphoBlueLendingPoolId
  /** The oracle used in the Morpho market */
  readonly oracle: IAddress
  /** The interest rate module used in the Morpho market */
  readonly irm: IAddress
  /** The liquidation LTV for the Morpho market */
  readonly lltv: IRiskRatio

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMorphoLendingPool
 */
export const MorphoBlueLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: MorphoBlueLendingPoolIdDataSchema,
  oracle: AddressDataSchema,
  irm: AddressDataSchema,
  lltv: RiskRatioDataSchema,
})

/**
 * Type for the data part of the IMorphoLendingPool interface
 */
export type IMorphoBlueLendingPoolData = Readonly<z.infer<typeof MorphoBlueLendingPoolDataSchema>>

/**
 * @description Type guard for IMorphoLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMorphoLendingPool
 */
export function isMorphoBlueLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMorphoBlueLendingPool {
  return MorphoBlueLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
