import { IProtocol, PositionIdDataSchema } from '@summerfi/sdk-common/common'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'

/**
 * @interface IArmadaProtocol
 * @description Interface for the Armada Protocol
 */
export interface IArmadaProtocol extends IProtocol, IArmadaProtocolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IArmadaProtocol'
}

/**
 * @description Zod schema for IArmadaProtocol
 */
export const ArmadaProtocolDataSchema = z.object({
  ...PositionIdDataSchema.shape,
  user: z.custom<IUser>((val) => isUser(val)),
})

/**
 * Type for the data part of IArmadaProtocol
 */
export type IArmadaProtocolData = Readonly<z.infer<typeof ArmadaProtocolDataSchema>>

/**
 * Type for the parameters of the IArmadaProtocol interface
 */
export type IArmadaProtocolParameters = Omit<IArmadaProtocol, 'type'>

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
