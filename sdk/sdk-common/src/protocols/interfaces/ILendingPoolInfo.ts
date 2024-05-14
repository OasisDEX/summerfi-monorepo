import { PoolType } from '../types'
import { ILendingPoolId, ILendingPoolIdData, LendingPoolIdSchema } from './ILendingPoolId'
import { IPoolInfo, IPoolInfoData, PoolInfoSchema } from './IPoolInfo'
import { CollateralInfoSchema, ICollateralInfo, ICollateralInfoData } from './ICollateralInfo'
import { DebtInfoSchema, IDebtInfo, IDebtInfoData } from './IDebtInfo'
import { z } from 'zod'

/**
 * @interface ILendingPoolInfoData
 * @description Represents the extended information for a lending pool of a single pair collateral/debt
 *
 * This extended information includes extra info for the collateral and debt like the liquidation threshold, liquidation penalty, total amount
 * borroed, etc...
 *
 * The intention of this interface is to standardize the information that the protocol plugins should provide for the lending pools and it is
 * not intended to be specialized by the protocol plugins. The reason for this is that the plugins already have this information and the SDK
 * tries to abstract this information to provide a common interface for all the protocols on the client side.
 *
 */
export interface ILendingPoolInfoData extends IPoolInfoData {
  /** Type of the pool, in this case Lending */
  readonly type: PoolType.Lending
  /** Pool ID of the lending pool */
  readonly id: ILendingPoolIdData
  /** The collateral information of the pool */
  readonly collateral: ICollateralInfoData
  /** The debt information of the pool */
  readonly debt: IDebtInfoData
}

/**
 * @name ILendingPoolInfo
 * @description Interface for the implementors of the lending pool info
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ILendingPoolInfo extends IPoolInfo, ILendingPoolInfoData {
  readonly type: PoolType.Lending
  readonly id: ILendingPoolId
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for ILendingPoolInfo
 */
export const LendingPoolInfoSchema = z.object({
  ...PoolInfoSchema.shape,
  type: z.literal(PoolType.Lending),
  id: LendingPoolIdSchema,
  collateral: CollateralInfoSchema,
  debt: DebtInfoSchema,
})

/**
 * @description Type guard for ILendingPoolInfo
 * @param maybePool Object to be checked
 * @returns true if the object is an ILendingPool
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPool
 */
export function isLendingPoolInfo(maybePool: unknown): maybePool is ILendingPoolInfoData {
  return LendingPoolInfoSchema.safeParse(maybePool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ILendingPoolInfoData = {} as z.infer<typeof LendingPoolInfoSchema>
