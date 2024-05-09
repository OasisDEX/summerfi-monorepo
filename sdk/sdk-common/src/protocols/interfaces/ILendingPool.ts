import { PoolType } from '../types'
import { ILendingPoolId, LendingPoolIdDataSchema } from './ILendingPoolId'
import { IPool } from './IPool'
import { z } from 'zod'

/**
 * @name ILendingPool
 * @description Represents a lending pool for a single pair collateral/debt
 *
 * A lending pool is a pool where users can deposit collateral and borrow debt against that collateral.
 * Typically the user will pay interest on the debt, and the collateral will be locked until the debt is repaid.
 *
 * This interface is an abstraction of a lending pool and the specialization for each protocol happens at the IPool
 * level through the PoolId
 */
export interface ILendingPool extends IPool, ILendingPoolData {
  /** Type of the pool, in this case Lending */
  readonly type: PoolType.Lending
  /** Pool ID of the lending pool */
  readonly id: ILendingPoolId
}

/**
 * @description Zod schema for ILendingPool
 */
export const LendingPoolDataSchema = z.object({
  type: z.literal(PoolType.Lending),
  id: LendingPoolIdDataSchema,
})

/**
 * Type for the data part of the ILendingPool interface
 */
export type ILendingPoolData = Readonly<z.infer<typeof LendingPoolDataSchema>>

/**
 * @description Type guard for ILendingPool
 * @param maybePool Object to be checked
 * @returns true if the object is an ILendingPool
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPool
 */
export function isLendingPool(maybePool: unknown): maybePool is ILendingPoolData {
  return LendingPoolDataSchema.safeParse(maybePool).success
}
