import { z } from 'zod'

/**
 * @name ProtocolName
 * @description Enumerates the names of the protocols that are supported by the SDK
 */
export enum ProtocolName {
  AAVEv3 = 'AAVEv3',
  AAVEv2 = 'AAVEv2',
  Spark = 'Spark',
  MorphoBlue = 'MorphoBlue',
  Maker = 'Maker',
  Ajna = 'Ajna',
}

/**
 * @description Type guard for ProtocolName
 * @param maybeProtocolName Object to be checked
 * @returns true if the object is a ProtocolName
 */
export function isProtocolName(maybeProtocolName: unknown): maybeProtocolName is ProtocolName {
  return Object.values(ProtocolName).includes(maybeProtocolName as ProtocolName)
}

/**
 * @description Zod schema for ProtocolName
 */
export const ProtocolNameSchema = z.nativeEnum(ProtocolName)
