import { FiatCurrency, FiatCurrencySchema } from '../enums/FiatCurrency'
import { IToken, ITokenData, TokenDataSchema } from '../interfaces/IToken'
import { z } from 'zod'

/**
 * Type for the denomination
 *
 * A denomination can be a token or a fiat currency
 */
export type DenominationData = ITokenData | FiatCurrency

/**
 * Type for the instances of denomination
 */
export type Denomination = IToken | FiatCurrency

/**
 * Zod schema for Denomination
 */
export const DenominationDataSchema = TokenDataSchema.or(FiatCurrencySchema)

/**
 * Type guard for Denomination
 *
 * @param maybeDenomination
 * @returns true if the value is a Denomination
 */
export function isDenomination(maybeDenomination: unknown): maybeDenomination is Denomination {
  return DenominationDataSchema.safeParse(maybeDenomination).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: DenominationData = {} as z.infer<typeof DenominationDataSchema>
