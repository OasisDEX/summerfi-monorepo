import { IChainInfo, IProtocol } from '@summerfi/sdk-common'
import { IProtocolData, ProtocolName, ProtocolDataSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IMakerProtocolData
 * @description Identifier of the Maker protocol
 */
export interface IMakerProtocolData extends IProtocolData {
  /** Maker protocol name */
  readonly name: ProtocolName.Maker
}

/**
 * @interface IMakerProtocol
 * @description Interface for the implementors of the Maker protocol
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerProtocol extends IProtocol, IMakerProtocolData {
  readonly name: ProtocolName.Maker

  // Re-declaring the properties with the correct types
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMakerProtocol
 */
export const MakerProtocolSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.literal(ProtocolName.Maker),
})

/**
 * @description Type guard for IMakerProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMakerProtocol
 */
export function isMakerProtocol(maybeProtocol: unknown): maybeProtocol is IMakerProtocolData {
  return MakerProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerProtocolData = {} as z.infer<typeof MakerProtocolSchema>
