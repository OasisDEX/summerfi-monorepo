import { IChainInfo, IProtocol, ProtocolDataSchema, ProtocolName } from '@summerfi/sdk-common'

import { z } from 'zod'

/**
 * @interface IAaveV3Protocol
 * @description Identifier of the Aave V3 protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3Protocol extends IProtocol, IAaveV3ProtocolData {
  /** Interface signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IAaveV3Protocol'

  // Re-declaring the properties with the correct types
  readonly name: ProtocolName
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IAaveV3Protocol
 */
export const AaveV3ProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.custom<ProtocolName>((val) => val === ProtocolName.AaveV3),
})

/**
 * Type for the data part of IAaveV3Protocol
 */
export type IAaveV3ProtocolData = Readonly<z.infer<typeof AaveV3ProtocolDataSchema>>

/**
 * Type for the parameters of the IAaveV3Protocol interface
 */
export type IAaveV3ProtocolParameters = Omit<IAaveV3ProtocolData, 'name'>

/**
 * @description Type guard for IAaveV3Protocol
 * @param maybeProtocol
 * @returns true if the object is an IAaveV3Protocol
 */
export function isAaveV3Protocol(maybeProtocol: unknown): maybeProtocol is IAaveV3ProtocolData {
  return AaveV3ProtocolDataSchema.safeParse(maybeProtocol).success
}
