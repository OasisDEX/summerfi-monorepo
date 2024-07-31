import { IChainInfo, IProtocol, ProtocolName } from '@summerfi/sdk-common'
import { ProtocolDataSchema } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __imakerprotocol__: unique symbol = Symbol()

/**
 * @interface IMakerProtocol
 * @description Identifier of the Maker protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerProtocol extends IProtocol, IMakerProtocolData {
  /** Interface signature used to differentiate it from similar interfaces */
  readonly [__imakerprotocol__]: 'IMakerProtocol'

  // Re-declaring the properties with the correct types
  readonly name: ProtocolName
  readonly chainInfo: IChainInfo
}

/**
 * @description Zod schema for IMakerProtocol
 */
export const MakerProtocolDataSchema = z.object({
  ...ProtocolDataSchema.shape,
  name: z.custom<ProtocolName>((val) => val === ProtocolName.Maker),
})

/**
 * Type for the data part of IMakerProtocol
 */
export type IMakerProtocolData = Readonly<z.infer<typeof MakerProtocolDataSchema>>

/**
 * Type for the parameters of the IMakerProtocol interface
 */
export type IMakerProtocolParameters = Omit<IMakerProtocolData, 'name'>

/**
 * @description Type guard for IMakerProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMakerProtocol
 */
export function isMakerProtocol(maybeProtocol: unknown): maybeProtocol is IMakerProtocolData {
  return MakerProtocolDataSchema.safeParse(maybeProtocol).success
}
