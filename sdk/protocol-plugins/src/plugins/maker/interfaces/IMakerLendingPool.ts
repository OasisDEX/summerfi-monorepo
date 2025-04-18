import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IMakerLendingPoolId, isMakerLendingPoolId } from './IMakerLendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMakerLendingPool
 * @description Represents a lending pool in the Maker protocol
 */
export interface IMakerLendingPool extends ILendingPool, IMakerLendingPoolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The pool's ID */
  readonly id: IMakerLendingPoolId
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
 * @description Type guard for IMakerLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMakerLendingPool
 */
export function isMakerLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMakerLendingPool {
  return MakerLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
