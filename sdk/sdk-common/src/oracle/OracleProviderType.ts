import { z } from 'zod'

/**
 * Enum for the different types of Oracle providers
 */
export enum OracleProviderType {
  OneInch = 'OneInch',
}

/**
 * @description Zod schema for OracleProviderType
 */
export const OracleProviderTypeSchema = z.nativeEnum(OracleProviderType)

/**
 * @description Type guard for OracleProviderType
 * @param maybeOracleProviderType
 * @returns true if the object is an OracleProviderType
 */
export function isOracleProviderType(
  maybeOracleProviderType: unknown,
): maybeOracleProviderType is OracleProviderType {
  return OracleProviderTypeSchema.safeParse(maybeOracleProviderType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: OracleProviderType = {} as z.infer<typeof OracleProviderTypeSchema>
