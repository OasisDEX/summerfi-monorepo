import { IChainInfo, IProtocol } from '@summerfi/sdk-common'
import { ProtocolName, ProtocolDataSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IMorphoProtocol
 * @description Identifier of the Morpho protocol
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoProtocol extends IMorphoProtocolData, IProtocol {
  /** Morpho protocol name */
  readonly name: ProtocolName.Morpho

  // Re-declare the properties with the correct types
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMorphoProtocol
 */
export const MorphoProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.Morpho),
})

/**
 * Type for the data part of the IMorphoProtocol interface
 */
export type IMorphoProtocolData = Readonly<z.infer<typeof MorphoProtocolDataSchema>>

/**
 * @description Type guard for IMorphoProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMorphoProtocol
 */
export function isMorphoProtocol(maybeProtocol: unknown): maybeProtocol is IMorphoProtocolData {
  return MorphoProtocolDataSchema.safeParse(maybeProtocol).success
}
