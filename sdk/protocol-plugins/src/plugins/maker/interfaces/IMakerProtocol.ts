import { IChainInfo, IProtocol, ProtocolName } from '@summerfi/sdk-common'
import { ProtocolDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IMakerProtocol
 * @description Identifier of the Maker protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerProtocol extends IProtocol, IMakerProtocolData {
  /** Maker protocol name */
  readonly name: ProtocolName.Maker

  // Re-declaring the properties with the correct types
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMakerProtocol
 */
export const MakerProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.Maker),
})

/**
 * Type for the data part of IMakerProtocol
 */
export type IMakerProtocolData = Readonly<z.infer<typeof MakerProtocolDataSchema>>

/**
 * @description Type guard for IMakerProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMakerProtocol
 */
export function isMakerProtocol(maybeProtocol: unknown): maybeProtocol is IMakerProtocolData {
  return MakerProtocolDataSchema.safeParse(maybeProtocol).success
}
