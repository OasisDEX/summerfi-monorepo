import { z } from 'zod'
import { IPool, PoolDataSchema } from '../../common/interfaces/IPool'
import { IToken, isToken } from '../../common/interfaces/IToken'
import { PoolType } from '../../common/enums/PoolType'
import { ILendingPoolId, isLendingPoolId } from './ILendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

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
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Pool ID of the lending pool */
  readonly id: ILendingPoolId
  /** Collateral token used to collateralized the pool */
  readonly collateralToken: IToken
  /** Debt token, which can be borrowed from the pool */
  readonly debtToken: IToken

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Lending
}

/**
 * @description Zod schema for ILendingPool
 */
export const LendingPoolDataSchema = z.object({
  ...PoolDataSchema.shape,
  type: z.literal(PoolType.Lending),
  id: z.custom<ILendingPoolId>((val) => isLendingPoolId(val)),
  collateralToken: z.custom<IToken>((val) => isToken(val)),
  debtToken: z.custom<IToken>((val) => isToken(val)),
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
export function isLendingPool(maybePool: unknown): maybePool is ILendingPool {
  return LendingPoolDataSchema.safeParse(maybePool).success
}
