import { z } from 'zod'
import { IAddress, isAddress } from './IAddress'
import { ChainInfoDataSchema, IChainInfo } from './IChainInfo'
import { IPrintable } from './IPrintable'

/**
 * @interface IEarnProtocolFleet
 * @description Interface for the Earn Protocol fleets
 */
export interface IEarnProtocolFleet extends IPrintable, IEarnProtocolFleetData {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_0: 'IEarnProtocolFleet'
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
  address: z.custom<IAddress>((val) => isAddress(val)),
})

/**
 * Type for the data part of the IEarnProtocolFleet interface
 */
export type IEarnProtocolFleetData = Readonly<z.infer<typeof EarnProtocolFleetDataSchema>>

/**
 * Type for the parameters of the IEarnProtocolFleet interface
 */
export type IEarnProtocolFleetParameters = Omit<IEarnProtocolFleetData, ''>

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
