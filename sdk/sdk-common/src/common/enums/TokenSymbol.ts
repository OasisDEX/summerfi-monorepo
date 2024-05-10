import { z } from 'zod'

/**
 * @enum TokenSymbol
 * @description Represents the symbol of a token
 */
export type TokenSymbol = string

/**
 * @description Zod schema for TokenSymbol
 */
export const TokenSymbolSchema = z.string()

/**
 * @description Type guard for TokenSymbol
 * @param maybeTokenSymbol
 * @returns true if the object is an TokenSymbol
 */
export function isTokenSymbol(maybeTokenSymbol: unknown): maybeTokenSymbol is TokenSymbol {
  return TokenSymbolSchema.safeParse(maybeTokenSymbol).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: TokenSymbol = {} as z.infer<typeof TokenSymbolSchema>
