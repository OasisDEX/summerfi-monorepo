import { z } from 'zod'
import { ProtocolName } from '../enums/ProtocolName'
import { ProtocolDataSchema, type IProtocol } from './IProtocol'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaProtocol
 * @description Interface for the Armada Protocol
 */
export interface IArmadaProtocol extends IProtocol, IArmadaProtocolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol

  // Re-declaring the properties to narrow the types
  readonly name: ProtocolName.Armada
}

/**
 * @description Zod schema for IArmadaProtocol
 */
export const ArmadaProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.Armada),
})

/**
 * Type for the data part of IArmadaProtocol
 */
export type IArmadaProtocolData = Readonly<z.infer<typeof ArmadaProtocolDataSchema>>

/**
 * @description Type guard for IArmadaProtocol
 * @param maybeArmadaProtocol Object to be checked
 * @returns true if the object is a IArmadaProtocol
 */
export function isArmadaProtocol(
  maybeArmadaProtocol: unknown,
): maybeArmadaProtocol is IArmadaProtocol {
  return ArmadaProtocolDataSchema.safeParse(maybeArmadaProtocol).success
}
