import {
  ChainInfoDataSchema,
  IChainInfo,
  IProtocol,
  ProtocolDataSchema,
} from '@summerfi/sdk-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IAaveV3Protocol
 * @description Identifier of the Aave V3 protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3Protocol extends IProtocol, IAaveV3ProtocolData {
  /** AaveV3 protocol name */
  readonly name: ProtocolName.AAVEv3

  // Re-declaring the properties with the correct types
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IAaveV3Protocol
 */
export const AaveV3ProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.AAVEv3),
  chainInfo: ChainInfoDataSchema,
})

/**
 * Type for the data part of IAaveV3Protocol
 */
export type IAaveV3ProtocolData = Readonly<z.infer<typeof AaveV3ProtocolDataSchema>>

/**
 * @description Type guard for IAaveV3Protocol
 * @param maybeProtocol
 * @returns true if the object is an IAaveV3Protocol
 */
export function isAaveV3Protocol(maybeProtocol: unknown): maybeProtocol is IAaveV3Protocol {
  return AaveV3ProtocolDataSchema.safeParse(maybeProtocol).success
}
