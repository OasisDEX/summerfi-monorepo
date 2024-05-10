import { z } from 'zod'

/**
 * @enum EmodeType
 * @description Enumerates the efficiency modes of a lending pool
 */
export enum EmodeType {
  None = 'None',
  Stablecoins = 'Stablecoins',
  ETHCorrelated = 'ETHCorrelated',
}

/**
 * @description Zod schema for EmodeType
 */
export const EmodeTypeSchema = z.nativeEnum(EmodeType)

/**
 * @description Type guard for EmodeType
 * @param maybeEmodeType Object to be checked
 * @returns true if the object is an EmodeType
 */
export function isEmodeType(maybeEmodeType: unknown): maybeEmodeType is EmodeType {
  return EmodeTypeSchema.safeParse(maybeEmodeType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: EmodeType = {} as z.infer<typeof EmodeTypeSchema>
