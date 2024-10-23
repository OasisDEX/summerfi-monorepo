import {
  IPoolInfo,
  ITokenAmount,
  PoolInfoDataSchema,
  PoolType,
  isTokenAmount,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaVaultId, isArmadaVaultId } from './IArmadaVaultId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaPoolInfo
 * @description Interface for an the extended info of an Armada Protocol pool (fleet)
 */
export interface IArmadaPoolInfo extends IPoolInfo, IArmadaPoolInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** ID of the pool */
  readonly id: IArmadaVaultId
  /** Maximum amount that can be deposited into the pool at this moment */
  readonly depositCap: ITokenAmount
  /** Total amount of assets currently deposited in the pool */
  readonly totalDeposits: ITokenAmount
  /** Total amount of shares currently minted in the pool */
  readonly totalShares: ITokenAmount

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
}

/**
 * @description Zod schema for IArmadaPoolInfo
 */
export const ArmadaPoolInfoDataSchema = z.object({
  ...PoolInfoDataSchema.shape,
  id: z.custom<IArmadaVaultId>((val) => isArmadaVaultId(val)),
  depositCap: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  totalDeposits: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  totalShares: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  type: z.literal(PoolType.Armada),
})

/**
 * Type for the data part of IArmadaPoolInfo
 */
export type IArmadaPoolInfoData = Readonly<z.infer<typeof ArmadaPoolInfoDataSchema>>

/**
 * @description Type guard for IArmadaPoolInfo
 * @param maybeArmadaPoolInfo Object to be checked
 * @returns true if the object is a IArmadaPoolInfo
 */
export function isArmadaPoolInfo(
  maybeArmadaPoolInfo: unknown,
): maybeArmadaPoolInfo is IArmadaPoolInfo {
  return ArmadaPoolInfoDataSchema.safeParse(maybeArmadaPoolInfo).success
}
