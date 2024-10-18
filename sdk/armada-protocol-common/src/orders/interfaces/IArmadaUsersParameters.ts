import { ITokenAmount, IUser, isTokenAmount, isUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IArmadaPoolId, isArmadaPoolId } from '../../common/interfaces/IArmadaPoolId'
import { ArmadaOperationType } from '../../types/ArmadaOperationType'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Parameters for an Armada Protocol simulation
 */
export interface IArmadaUsersParameters extends IArmadaUsersParametersData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** User that triggered the simulation */
  readonly user: IUser
  /** ID of the pool where the operation is taking place */
  readonly poolId: IArmadaPoolId
  /** Type of operation */
  readonly operation: ArmadaOperationType
  /** Amount to be deposited/withdrawn */
  readonly amount: ITokenAmount
}

/**
 * Zod schema for the Armada parameters
 */
export const ArmadaUsersParametersDataSchema = z.object({
  user: z.custom<IUser>(isUser),
  poolId: z.custom<IArmadaPoolId>(isArmadaPoolId),
  operation: z.nativeEnum(ArmadaOperationType),
  amount: z.custom<ITokenAmount>(isTokenAmount),
})

/**
 * Type for the data part of the IArmadaParameters interface
 */
export type IArmadaUsersParametersData = Readonly<z.infer<typeof ArmadaUsersParametersDataSchema>>

/**
 * Type guard for the Armada Protocol simulation parameters
 *
 * @param maybeArmadaParameters Parameters to check
 *
 * @returns True if the parameters are valid
 */
export function isArmadaUsersParameters(
  maybeArmadaParameters: unknown,
): maybeArmadaParameters is IArmadaUsersParameters {
  return ArmadaUsersParametersDataSchema.safeParse(maybeArmadaParameters).success
}
