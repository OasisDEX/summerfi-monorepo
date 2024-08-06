import {
  IPoolInfo,
  ITokenAmount,
  PoolInfoDataSchema,
  PoolType,
  isTokenAmount,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaPoolId, isArmadaPoolId } from './IArmadaPoolId'

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
  readonly id: IArmadaPoolId
  /** Maximum amount that can be deposited into the pool at this moment */
  readonly depositCap: ITokenAmount
  /** Maximum amount that can be withdrawn from the pool at this moment for a forced withdraw operation */
  readonly withdrawCap: ITokenAmount
  /** Maximum amount that can be withdrawn from the pool's buffer at this moment, this is, without a force withdraw */
  readonly maxWithdrawFromBuffer: ITokenAmount

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
}

/**
 * @description Zod schema for IArmadaPoolInfo
 */
export const ArmadaPoolInfoDataSchema = z.object({
  ...PoolInfoDataSchema.shape,
  id: z.custom<IArmadaPoolId>((val) => isArmadaPoolId(val)),
  depositCap: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  withdrawCap: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  maxWithdrawFromBuffer: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
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
