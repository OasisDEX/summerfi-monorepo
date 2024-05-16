import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common/protocols'
import { IMakerLendingPoolId, MakerLendingPoolIdDataSchema } from './IMakerLendingPoolId'
import { z } from 'zod'
import { IToken } from '@summerfi/sdk-common/common'

/**
 * @interface IMakerLendingPool
 * @description Represents a lending pool in the Maker protocol
 */
export interface IMakerLendingPool extends ILendingPool, IMakerLendingPoolData {
  /** The pool's ID */
  readonly id: IMakerLendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMakerLendingPool
 */
export const MakerLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: MakerLendingPoolIdDataSchema,
})

/**
 * Type for the data part of IMakerLendingPool
 */
export type IMakerLendingPoolData = Readonly<z.infer<typeof MakerLendingPoolDataSchema>>

/**
 * @description Type guard for IMakerLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMakerLendingPool
 */
export function isMakerLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMakerLendingPool {
  return MakerLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
