import { ITokenAmount, IUser, isTokenAmount, isUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IArmadaPosition, isArmadaPosition } from '../../common'
import { ArmadaOperationType } from '../../types/ArmadaOperationType'

/**
 * Parameters for an Armada Protocol simulation
 */
export interface IArmadaParameters extends IArmadaParametersData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_0: 'IArmadaParameters'
  /** User that triggered the simulation */
  readonly user: IUser
  /** Existing position to be updated, if it exists */
  readonly previousPosition?: IArmadaPosition
  /** Type of operation */
  readonly operation: ArmadaOperationType
  /** Amount to be deposited/withdrawn */
  readonly amount: ITokenAmount
}

/**
 * Zod schema for the refinance parameters
 */
export const ArmadaParametersDataSchema = z.object({
  user: z.custom<IUser>((val) => isUser(val)),
  previousPosition: z.custom<IArmadaPosition | undefined>(
    (val) => val === undefined || isArmadaPosition(val),
  ),
  operation: z.nativeEnum(ArmadaOperationType),
  amount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
})

/**
 * Type for the data part of the IArmadaParameters interface
 */
export type IArmadaParametersData = Readonly<z.infer<typeof ArmadaParametersDataSchema>>

/**
 * Type for the parameters of the IArmadaParameters interface
 */
export type IArmadaParametersParameters = Omit<IArmadaParametersData, ''>

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
