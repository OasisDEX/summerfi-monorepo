import { IChainInfo, IProtocol } from '@summerfi/sdk-common'
import { ProtocolDataSchema, ProtocolName } from '@summerfi/sdk-common/common'
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
  /** Interface signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IMorphoProtocol'

  // Re-declare the properties with the correct types
  readonly name: ProtocolName
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMorphoProtocol
 */
export const MorphoProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.custom<ProtocolName>((val) => val === ProtocolName.MorphoBlue),
})

/**
 * Type for the data part of the IMorphoProtocol interface
 */
export type IMorphoProtocolData = Readonly<z.infer<typeof MorphoProtocolDataSchema>>

/**
 * Type for the parameters of the IMorphoProtocol interface
 */
export type IMorphoProtocolParameters = Omit<IMorphoProtocolData, 'name'>

/**
 * @description Type guard for IMorphoProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMorphoProtocol
 */
export function isMorphoProtocol(maybeProtocol: unknown): maybeProtocol is IMorphoProtocol {
  return MorphoProtocolDataSchema.safeParse(maybeProtocol).success
}
