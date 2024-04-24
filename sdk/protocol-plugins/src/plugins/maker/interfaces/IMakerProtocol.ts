import { IProtocol } from '@summerfi/sdk-common'
import { ProtocolName, ProtocolSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

/**
 * @interface IMakerProtocol
 * @description Identifier of the Maker protocol
 */
export interface IMakerProtocol extends IProtocol {
  /** Maker protocol name */
  name: ProtocolName.Maker
}

/**
 * @description Zod schema for IMakerProtocol
 */
export const MakerProtocolSchema = z.object({
  ...ProtocolSchema.shape,
  name: z.literal(ProtocolName.Maker),
})

/**
 * @description Type guard for IMakerProtocol
 * @param maybeProtocol
 * @returns true if the object is an IMakerProtocol
 */
export function isMakerProtocol(maybeProtocol: unknown): maybeProtocol is IMakerProtocol {
  return MakerProtocolSchema.safeParse(maybeProtocol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerProtocol = {} as z.infer<typeof MakerProtocolSchema>
