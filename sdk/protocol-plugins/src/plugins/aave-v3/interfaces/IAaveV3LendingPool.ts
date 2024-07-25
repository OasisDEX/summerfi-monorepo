import { PoolType } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPool, LendingPoolDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { AaveV3LendingPoolIdDataSchema, IAaveV3LendingPoolId } from './IAaveV3LendingPoolId'

/**
 * @interface IAaveV3LendingPool
 * @description Represents a lending pool in the Aave V3 protocol
 */
export interface IAaveV3LendingPool extends ILendingPool, IAaveV3LendingPoolData {
  /** The lending pool's ID */
  readonly id: IAaveV3LendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IAaveV3LendingPool
 */
export const AaveV3LendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: AaveV3LendingPoolIdDataSchema,
})

/**
 * Type for the data part of IAaveV3LendingPool
 */
export type IAaveV3LendingPoolData = Readonly<z.infer<typeof AaveV3LendingPoolDataSchema>>

/**
 * @description Type guard for IAaveV3LendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IAaveV3LendingPool
 */
export function isAaveV3LendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IAaveV3LendingPool {
  return AaveV3LendingPoolDataSchema.safeParse(maybeLendingPool).success
}
