import { PoolType } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { IMakerLendingPoolId, isMakerLendingPoolId } from './IMakerLendingPoolId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __imakerlendingpool__: unique symbol = Symbol()

/**
 * @interface IMakerLendingPool
 * @description Represents a lending pool in the Maker protocol
 */
export interface IMakerLendingPool extends ILendingPool, IMakerLendingPoolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__imakerlendingpool__]: 'IMakerLendingPool'
  /** The pool's ID */
  readonly id: IMakerLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMakerLendingPool
 */
export const MakerLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: z.custom<IMakerLendingPoolId>((val) => isMakerLendingPoolId(val)),
})

/**
 * Type for the data part of IMakerLendingPool
 */
export type IMakerLendingPoolData = Readonly<z.infer<typeof MakerLendingPoolDataSchema>>

/**
 * Type for the parameters of the IMakerLendingPool interface
 */
export type IMakerLendingPoolParameters = Omit<IMakerLendingPoolData, 'type'>

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
