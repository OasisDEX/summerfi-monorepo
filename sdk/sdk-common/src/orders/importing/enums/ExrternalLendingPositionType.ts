import { z } from 'zod'

/**
 * Type of external position
 *
 * Used for importing positions from external sources into the Summer system
 */
export enum ExternalLendingPositionType {
  /** EOA directly owned position */
  WALLET = 'WALLET',
  /** Maker legacy DS Proxy owned position */
  DS_PROXY = 'DS_PROXY',
}

/**
 * @description Zod schema for ExternalPositionType
 */
export const ExternalLendingPositionTypeSchema = z.nativeEnum(ExternalLendingPositionType)

/**
 * @description Type guard for ExternalPositionType
 * @param maybeExternalLendingPositionType Object to be checked
 * @returns true if the object is a ExternalPositionType
 */
export function isExternalLendingPositionType(
  maybeExternalLendingPositionType: unknown,
): maybeExternalLendingPositionType is ExternalLendingPositionType {
  return ExternalLendingPositionTypeSchema.safeParse(maybeExternalLendingPositionType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const __schemaChecker: ExternalLendingPositionType = {} as z.infer<
  typeof ExternalLendingPositionTypeSchema
>
