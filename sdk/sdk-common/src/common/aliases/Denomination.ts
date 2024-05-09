import { FiatCurrency, FiatCurrencySchema } from '../enums/FiatCurrency'
import { IToken, ITokenData, TokenDataSchema } from '../interfaces/IToken'
import { z } from 'zod'

/**
 * @name DenominationData
 * @description Type for the denomination
 *
 * A denomination can be a token or a fiat currency
 */
export type DenominationData = ITokenData | FiatCurrency

/**
 * @name Denomination
 * @description Type for the instances of denomination
 */
export type Denomination = IToken | FiatCurrency

/**
 * @description Zod schema for Denomination
 */
export const DenominationSchema = TokenDataSchema.or(FiatCurrencySchema)

/**
 * @description Type guard for Denomination
 * @param maybeDenomination
 * @returns true if the value is a Denomination
 */
export function isDenomination(maybeDenomination: unknown): maybeDenomination is Denomination {
  return DenominationSchema.safeParse(maybeDenomination).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: DenominationData = {} as z.infer<typeof DenominationSchema>
