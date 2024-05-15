import { PoolType } from '../types'
import { ILendingPoolId, LendingPoolIdDataSchema } from './ILendingPoolId'
import { IPoolInfo, PoolInfoDataSchema } from './IPoolInfo'
import { CollateralInfoDataSchema, ICollateralInfo } from './ICollateralInfo'
import { DebtInfoDataSchema, IDebtInfo } from './IDebtInfo'
import { z } from 'zod'

/**
 * @name ILendingPoolInfo
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
export interface ILendingPoolInfo extends IPoolInfo, ILendingPoolInfoData {
  /** Type of the pool, in this case Lending */
  readonly type: PoolType.Lending
  /** Pool ID of the lending pool */
  readonly id: ILendingPoolId
  /** The collateral information of the pool */
  readonly collateral: ICollateralInfo
  /** The debt information of the pool */
  readonly debt: IDebtInfo
}

/**
 * @description Zod schema for ILendingPoolInfo
 */
export const LendingPoolInfoDataSchema = z.object({
  ...PoolInfoDataSchema.shape,
  type: z.literal(PoolType.Lending),
  id: LendingPoolIdDataSchema,
  collateral: CollateralInfoDataSchema,
  debt: DebtInfoDataSchema,
})

/**
 * Type for the data part of the ILendingPoolInfo interface
 */
export type ILendingPoolInfoData = Readonly<z.infer<typeof LendingPoolInfoDataSchema>>

/**
 * @description Type guard for ILendingPoolInfo
 * @param maybePool Object to be checked
 * @returns true if the object is an ILendingPool
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPool
 */
export function isLendingPoolInfo(maybePool: unknown): maybePool is ILendingPoolInfoData {
  return LendingPoolInfoDataSchema.safeParse(maybePool).success
}
