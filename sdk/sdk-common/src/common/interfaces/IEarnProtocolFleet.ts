import { z } from 'zod'
import { AddressDataSchema, IAddress } from './IAddress'
import { ChainInfoDataSchema, IChainInfo } from './IChainInfo'

/**
 * @interface IEarnProtocolFleet
 * @description Interface for the Earn Protocol fleets
 */
export interface IEarnProtocolFleet {
  /** Chain where the Fleet entrypoint contract is deployed */
  readonly chainInfo: IChainInfo
  /** Address of the Fleet entrypoint contract (FleetCommander) */
  readonly address: IAddress
}

/**
 * @description Zod schema for IEarnProtocolFleet
 */
export const EarnProtocolFleetDataSchema = z.object({
  chainInfo: ChainInfoDataSchema,
  address: AddressDataSchema,
})

/**
 * Type for the data part of the IEarnProtocolFleet interface
 */
export type IEarnProtocolFleetData = Readonly<z.infer<typeof EarnProtocolFleetDataSchema>>

/**
 * @description Type guard for IEarnProtocolFleet
 * @param maybeEarnProtocolFleet
 * @returns true if the object is an IEarnProtocolFleet
 */
export function isEarnProtocolFleet(
  maybeEarnProtocolFleet: unknown,
  returnedErrors?: string[],
): maybeEarnProtocolFleet is IEarnProtocolFleet {
  const zodReturn = EarnProtocolFleetDataSchema.safeParse(maybeEarnProtocolFleet)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
