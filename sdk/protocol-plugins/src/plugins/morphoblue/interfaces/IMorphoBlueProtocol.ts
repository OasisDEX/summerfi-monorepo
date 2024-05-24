import { IChainInfo, IProtocol } from '@summerfi/sdk-common'
import { ProtocolName, ProtocolDataSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IMorphoBlueProtocol
 * @description Identifier of the Morpho protocol
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoBlueProtocol extends IMorphoBlueProtocolData, IProtocol {
  /** Morpho protocol name */
  readonly name: ProtocolName.MorphoBlue

  // Re-declare the properties with the correct types
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMorphoProtocol
 */
export const MorphoBlueProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.MorphoBlue),
})

/**
 * Type for the data part of the IMorphoProtocol interface
 */
export type IMorphoBlueProtocolData = Readonly<z.infer<typeof MorphoBlueProtocolDataSchema>>

/**
 * @description Type guard for IMorphoProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMorphoProtocol
 */
export function isMorphoBlueProtocol(maybeProtocol: unknown): maybeProtocol is IMorphoBlueProtocol {
  return MorphoBlueProtocolDataSchema.safeParse(maybeProtocol).success
}
