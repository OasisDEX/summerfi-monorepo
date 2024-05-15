import { z } from 'zod'

/**
 * @name ProtocolName
 * @description Enumerates the names of the protocols that are supported by the SDK
 */
export enum ProtocolName {
  AAVEv3 = 'AAVEv3',
  AAVEv2 = 'AAVEv2',
  Spark = 'Spark',
  Morpho = 'Morpho',
  Maker = 'Maker',
  Ajna = 'Ajna',
}

/**
 * @description Zod schema for ProtocolName
 */
export const ProtocolNameSchema = z.nativeEnum(ProtocolName)

/**
 * @description Type guard for ProtocolName
 * @param maybeProtocolName Object to be checked
 * @returns true if the object is a ProtocolName
 */
export function isProtocolName(maybeProtocolName: unknown): maybeProtocolName is ProtocolName {
  return ProtocolNameSchema.safeParse(maybeProtocolName).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const __schemaChecker: ProtocolName = {} as z.infer<typeof ProtocolNameSchema>
