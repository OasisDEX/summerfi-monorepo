import { IUser, isUser } from '@summerfi/sdk-common'
import { z } from 'zod'
import { IArmadaPoolId, isArmadaPoolId } from '../../common/interfaces/IArmadaPoolId'
import {
  IArmadaRebalanceData,
  isArmadaRebalanceData,
} from '../../common/interfaces/IArmadaRebalanceData'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Parameters for an Armada Protocol simulation
 */
export interface IArmadaKeepersParameters extends IArmadaKeepersParametersData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Keeper that triggered the simulation */
  readonly keeper: IUser
  /** ID of the pool where the operation is taking place */
  readonly poolId: IArmadaPoolId
  /** Rebalance data */
  readonly rebalanceData: IArmadaRebalanceData[]
}

/**
 * Zod schema for the Armada parameters
 */
export const ArmadaKeepersParametersDataSchema = z.object({
  keeper: z.custom<IUser>((val) => isUser(val)),
  poolId: z.custom<IArmadaPoolId>((val) => isArmadaPoolId(val)),
  rebalanceData: z.custom<IArmadaRebalanceData[]>((val) =>
    (val as unknown[]).every((val) => isArmadaRebalanceData(val)),
  ),
})

/**
 * Type for the data part of the IArmadaParameters interface
 */
export type IArmadaKeepersParametersData = Readonly<
  z.infer<typeof ArmadaKeepersParametersDataSchema>
>

/**
 * Type guard for the Armada Protocol simulation parameters
 *
 * @param maybeArmadaParameters Parameters to check
 *
 * @returns True if the parameters are valid
 */
export function isArmadaKeepersParameters(
  maybeArmadaParameters: unknown,
): maybeArmadaParameters is IArmadaKeepersParameters {
  return ArmadaKeepersParametersDataSchema.safeParse(maybeArmadaParameters).success
}
