import {
  ILendingPool,
  ILendingPoolData,
  LendingPoolDataSchema,
} from '@summerfi/sdk-common/protocols'
import {
  AaveV3LendingPoolIdSchema,
  IAaveV3LendingPoolId,
  IAaveV3LendingPoolIdData,
} from './IAaveV3LendingPoolId'
import { IToken } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IAaveV3LendingPoolData
 * @description Represents a lending pool in the Aave V3 protocol
 */
export interface IAaveV3LendingPoolData extends ILendingPoolData {
  /** The lending pool's ID */
  readonly id: IAaveV3LendingPoolIdData
}

/**
 * @interface IAaveV3LendingPool
 * @description Interface for the implementors of the lending pool
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IAaveV3LendingPool extends ILendingPool, IAaveV3LendingPoolData {
  readonly id: IAaveV3LendingPoolId

  // Re-declaring the properties with the correct types
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IAaveV3LendingPool
 */
export const AaveV3LendingPoolSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: AaveV3LendingPoolIdSchema,
})

/**
 * @description Type guard for IAaveV3LendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IAaveV3LendingPool
 */
export function isAaveV3LendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IAaveV3LendingPoolData {
  return AaveV3LendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3LendingPoolData = {} as z.infer<typeof AaveV3LendingPoolSchema>
