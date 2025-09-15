import { IPoolInfo, PoolInfoDataSchema } from './IPoolInfo'
import { z } from 'zod'
import { IArmadaVaultId, isArmadaVaultId } from './IArmadaVaultId'
import { isTokenAmount, type ITokenAmount } from './ITokenAmount'
import { PoolType } from '../enums/PoolType'
import { isPercentage, type IPercentage } from './IPercentage'
import { isToken, type IToken } from './IToken'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaVaultInfo
 * @description Interface for an the extended info of an Armada Protocol vault (fleet)
 */
export interface IArmadaVaultInfo extends IPoolInfo, IArmadaVaultInfoData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** ID of the vault */
  readonly id: IArmadaVaultId
  /** Token of the vault */
  readonly token: IToken
  /** Underlying asset token that can be deposited into the vault */
  readonly assetToken: IToken
  /** Maximum amount that can be deposited into the vault at this moment */
  readonly depositCap: ITokenAmount
  /** Total amount of assets currently deposited in the vault */
  readonly totalDeposits: ITokenAmount
  /** Total amount of shares currently minted in the vault */
  readonly totalShares: ITokenAmount
  /** Vault apy */
  readonly apy: IPercentage | null
  /** Vault SUMR rewards apy */
  readonly rewardsApys: Array<{
    token: IToken
    apy: IPercentage | null
  }>
  /** Vault Merkl rewards apy */
  readonly merklRewards: Array<{
    token: IToken
    dailyEmission: string
  }>

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
}

/**
 * @description Zod schema for IArmadaVaultInfo
 */
export const ArmadaVaultInfoDataSchema = z.object({
  ...PoolInfoDataSchema.shape,
  id: z.custom<IArmadaVaultId>((val) => isArmadaVaultId(val)),
  token: z.custom<IToken>((val) => isToken(val)),
  assetToken: z.custom<IToken>((val) => isToken(val)),
  depositCap: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  totalDeposits: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  totalShares: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  apy: z.custom<IPercentage | null>((val) => isPercentage(val) || val === null),
  rewardsApys: z.array(
    z.object({
      token: z.custom<IToken>((val) => isToken(val)),
      apy: z.custom<IPercentage | null>((val) => isPercentage(val) || val === null),
    }),
  ),
  merklRewards: z.array(
    z.object({
      token: z.custom<IToken>((val) => isToken(val)),
      dailyEmission: z.string(),
    }),
  ),
  type: z.literal(PoolType.Armada),
})

/**
 * Type for the data part of IArmadaVaultInfo
 */
export type IArmadaVaultInfoData = Readonly<z.infer<typeof ArmadaVaultInfoDataSchema>>

/**
 * @description Type guard for IArmadaVaultInfo
 * @param maybeArmadaVaultInfo Object to be checked
 * @returns true if the object is a IArmadaVaultInfo
 */
export function isArmadaVaultInfo(
  maybeArmadaVaultInfo: unknown,
): maybeArmadaVaultInfo is IArmadaVaultInfo {
  return ArmadaVaultInfoDataSchema.safeParse(maybeArmadaVaultInfo).success
}
