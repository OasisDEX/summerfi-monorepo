import { z } from 'zod'

/**
 * Parameters for an Earn Protocol simulation
 */
export interface IEarnProtocolParameters extends IEarnProtocolParametersData {
  // Empty on purpose
}

/**
 * Zod schema for the refinance parameters
 */
export const EarnProtocolParametersDataSchema = z.object({})

export type IEarnProtocolParametersData = Readonly<z.infer<typeof EarnProtocolParametersDataSchema>>

/**
 * Type guard for the Earn Protocol simulation parameters
 *
 * @param maybeEarnProtocolParameters Parameters to check
 *
 * @returns True if the parameters are valid
 */
export function isEarnProtocolParameters(
  maybeEarnProtocolParameters: unknown,
): maybeEarnProtocolParameters is IEarnProtocolParameters {
  return EarnProtocolParametersDataSchema.safeParse(maybeEarnProtocolParameters).success
}
