import { IProtocol, ProtocolName } from '@summerfi/sdk-common'
import { ProtocolDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMakerProtocol
 * @description Identifier of the Maker protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerProtocol extends IProtocol, IMakerProtocolData {
  /** Interface signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol

  // Re-declaring the properties to narrow the types
  readonly name: ProtocolName.Maker
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
