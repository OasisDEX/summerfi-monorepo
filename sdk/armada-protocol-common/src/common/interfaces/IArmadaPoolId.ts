import { IPoolId, PoolIdDataSchema, PoolType } from '@summerfi/sdk-common/common'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'
import { IArmadaProtocol, isArmadaProtocol } from './IArmadaProtocol'

/**
 * @interface IArmadaPoolId
 * @description Interface for an ID of an Armada Protocol pool (fleet)
 */
export interface IArmadaPoolId extends IPoolId, IArmadaPoolIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IArmadaPoolId'
  /** User that opened the position, used to identify the position in a Fleet Commander */
  readonly user: IUser

  // Re-declaring the properties with the correct types
  readonly type: PoolType
  readonly protocol: IArmadaProtocol
}

/**
 * @description Zod schema for IArmadaPoolId
 */
export const ArmadaPoolIdDataSchema = z.object({
  ...PoolIdDataSchema.shape,
  user: z.custom<IUser>((val) => isUser(val)),
  protocol: z.custom<IArmadaProtocol>((val) => isArmadaProtocol(val)),
})

/**
 * Type for the data part of IArmadaPoolId
 */
export type IArmadaPoolIdData = Readonly<z.infer<typeof ArmadaPoolIdDataSchema>>

/**
 * Type for the parameters of the IArmadaPoolId interface
 */
export type IArmadaPoolIdParameters = Omit<IArmadaPoolIdData, 'type'>

/**
 * @description Type guard for IArmadaPoolId
 * @param maybeArmadaPoolId Object to be checked
 * @returns true if the object is a IMakerLendingPosition
 */
export function isArmadaPoolId(maybeArmadaPoolId: unknown): maybeArmadaPoolId is IArmadaPoolId {
  return ArmadaPoolIdDataSchema.safeParse(maybeArmadaPoolId).success
}
