import { LendingPoolDataSchema } from '@summerfi/sdk-common/protocols'
import { IMorphoLendingPoolId, MorphoLendingPoolIdDataSchema } from './IMorphoLendingPoolId'
import { ILendingPool, IToken, PoolType } from '@summerfi/sdk-common'
import { z } from 'zod'
import {
  AddressDataSchema,
  IAddress,
  IPercentage,
  PercentageDataSchema,
} from '@summerfi/sdk-common/common'

/**
 * @interface IMorphoLendingPool
 * @description Represents a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPool extends IMorphoLendingPoolData, ILendingPool {
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolId
  /** The oracle used in the Morpho market */
  readonly oracle: IAddress
  /** The interest rate module used in the Morpho market */
  readonly irm: IAddress
  /** The liquidation LTV for the Morpho market */
  readonly lltv: IPercentage

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMorphoLendingPool
 */
export const MorphoLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: MorphoLendingPoolIdDataSchema,
  oracle: AddressDataSchema,
  irm: AddressDataSchema,
  lltv: PercentageDataSchema,
})

/**
 * Type for the data part of the IMorphoLendingPool interface
 */
export type IMorphoLendingPoolData = Readonly<z.infer<typeof MorphoLendingPoolDataSchema>>

/**
 * @description Type guard for IMorphoLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMorphoLendingPool
 */
export function isMorphoLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMorphoLendingPool {
  return MorphoLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
