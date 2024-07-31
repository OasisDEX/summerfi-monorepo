import { z } from 'zod'
import { IAddress, isAddress } from './IAddress'
import { ChainInfoDataSchema, IChainInfo } from './IChainInfo'
import { IPrintable } from './IPrintable'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaFleet
 * @description Interface for the Armada Protocol fleets
 */
export interface IArmadaFleet extends IPrintable, IArmadaFleetData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Chain where the Fleet entrypoint contract is deployed */
  readonly chainInfo: IChainInfo
  /** Address of the Fleet entrypoint contract (FleetCommander) */
  readonly address: IAddress
}

/**
 * @description Zod schema for IArmadaFleet
 */
export const ArmadaFleetDataSchema = z.object({
  chainInfo: ChainInfoDataSchema,
  address: z.custom<IAddress>((val) => isAddress(val)),
})

/**
 * Type for the data part of the IArmadaFleet interface
 */
export type IArmadaFleetData = Readonly<z.infer<typeof ArmadaFleetDataSchema>>

/**
 * Type for the parameters of the IArmadaFleet interface
 */
export type IArmadaFleetParameters = Omit<IArmadaFleetData, ''>

/**
 * @description Type guard for IArmadaFleet
 * @param maybeArmadaFleet
 * @returns true if the object is an IArmadaFleet
 */
export function isArmadaFleet(
  maybeArmadaFleet: unknown,
  returnedErrors?: string[],
): maybeArmadaFleet is IArmadaFleet {
  const zodReturn = ArmadaFleetDataSchema.safeParse(maybeArmadaFleet)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
