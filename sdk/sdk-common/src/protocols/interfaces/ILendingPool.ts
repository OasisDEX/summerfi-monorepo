import { PoolType } from '../types'
import { ILendingPoolId, ILendingPoolIdData, LendingPoolIdSchema } from './ILendingPoolId'
import { IPoolData } from './IPool'
import { z } from 'zod'

/**
 * @interface ILendingPoolData
 * @description Represents a lending pool for a single pair collateral/debt
 *
 * A lending pool is a pool where users can deposit collateral and borrow debt against that collateral.
 * Typically the user will pay interest on the debt, and the collateral will be locked until the debt is repaid.
 *
 * This interface is an abstraction of a lending pool and the specialization for each protocol happens at the IPool
 * level through the PoolId
 *
 */
export interface ILendingPoolData extends IPoolData {
  /** Type of the pool, in this case Lending */
  type: PoolType.Lending
  /** Pool ID of the lending pool */
  id: ILendingPoolIdData
}

/**
 * @name ILendingPool
 * @description Interface for the implementors of the lending pool
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ILendingPool extends ILendingPoolData {
  type: PoolType.Lending
  id: ILendingPoolId
}

/**
 * @description Zod schema for ILendingPool
 */
export const LendingPoolSchema = z.object({
  type: z.literal(PoolType.Lending),
  id: LendingPoolIdSchema,
})

/**
 * @description Type guard for ILendingPool
 * @param maybePool Object to be checked
 * @returns true if the object is an ILendingPool
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPool
 */
export function isLendingPool(maybePool: unknown): maybePool is ILendingPoolData {
  return LendingPoolSchema.safeParse(maybePool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ILendingPoolData = {} as z.infer<typeof LendingPoolSchema>
