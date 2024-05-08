import { IChainInfo, IProtocol } from '@summerfi/sdk-common'
import { IProtocolData, ProtocolName, ProtocolSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IMorphoProtocolData
 * @description Identifier of the Morpho protocol
 */
export interface IMorphoProtocolData extends IProtocolData {
  /** Morpho protocol name */
  readonly name: ProtocolName.Morpho
}

/**
 * @interface IMorphoProtocol
 * @description Interface for the implementors of the Morpho protocol
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoProtocol extends IMorphoProtocolData, IProtocol {
  readonly name: ProtocolName.Morpho
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMorphoProtocol
 */
export const MorphoProtocolSchema = z.object({
  ...ProtocolSchema.shape,
  name: z.literal(ProtocolName.Morpho),
})

/**
 * @description Type guard for IMorphoProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMorphoProtocol
 */
export function isMorphoProtocol(maybeProtocol: unknown): maybeProtocol is IMorphoProtocolData {
  return MorphoProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMorphoProtocolData = {} as z.infer<typeof MorphoProtocolSchema>
