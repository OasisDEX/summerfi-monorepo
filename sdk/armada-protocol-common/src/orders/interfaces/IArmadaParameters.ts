import {
  ITokenAmount,
  IUser,
  isTokenAmount,
  isUser,
  ArmadaOperationType,
  isArmadaVaultId,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Parameters for an Armada Protocol simulation
 */
export interface IArmadaParameters extends IArmadaParametersData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** User that triggered the simulation */
  readonly user: IUser
  /** ID of the pool where the operation is taking place */
  readonly poolId: IArmadaVaultId
  /** Type of operation */
  readonly operation: ArmadaOperationType
  /** Amount to be deposited/withdrawn */
  readonly amount: ITokenAmount
}

/**
 * Zod schema for the Armada parameters
 */
export const ArmadaParametersDataSchema = z.object({
  user: z.custom<IUser>((val) => isUser(val)),
  poolId: z.custom<IArmadaVaultId>((val) => isArmadaVaultId(val)),
  operation: z.nativeEnum(ArmadaOperationType),
  amount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
})

/**
 * Type for the data part of the IArmadaParameters interface
 */
export type IArmadaParametersData = Readonly<z.infer<typeof ArmadaParametersDataSchema>>

/**
 * Type guard for the Armada Protocol simulation parameters
 *
 * @param maybeArmadaParameters Parameters to check
 *
 * @returns True if the parameters are valid
 */
export function isArmadaParameters(
  maybeArmadaParameters: unknown,
): maybeArmadaParameters is IArmadaParameters {
  return ArmadaParametersDataSchema.safeParse(maybeArmadaParameters).success
}
