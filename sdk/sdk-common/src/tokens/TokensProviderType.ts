import { z } from 'zod'

/**
 * Enum for the different types of tokens providers.
 */
export enum TokensProviderType {
  /** Pre-built list of tokens */
  Static = 'Static',
}

/**
 * Zod schema for the TokensProviderType enum.
 */
export const TokensProviderTypeSchema = z.nativeEnum(TokensProviderType)

/**
 * Type guard for TokensProviderType
 * @param maybeTokensProviderType Object to be checked
 * @returns true if the object is a TokensProviderType
 */
export function isTokensProviderType(
  maybeTokensProviderType: unknown,
): maybeTokensProviderType is TokensProviderType {
  return TokensProviderTypeSchema.safeParse(maybeTokensProviderType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const __schemaChecker: TokensProviderType = {} as z.infer<typeof TokensProviderTypeSchema>
