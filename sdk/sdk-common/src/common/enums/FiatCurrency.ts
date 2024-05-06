import { z } from 'zod'

/**
 * @enum FiatCurrency
 * @description Used to indicate a currency
 *
 * It is the counterpart of a Token in real world assets
 */
export enum FiatCurrency {
  USD = 'USD',
}

/**
 * @name FiatCurrencySchema
 * @description Zod schema for the FiatCurrency enum
 */
export const FiatCurrencySchema = z.nativeEnum(FiatCurrency)

/**
 * @name isFiatCurrency
 * @param value Value to check if it is a FiatCurrency
 * @returns true if the value is a FiatCurrency
 */
export function isFiatCurrency(value: unknown): value is FiatCurrency {
  return FiatCurrencySchema.safeParse(value).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const __schemaChecker: FiatCurrency = {} as z.infer<typeof FiatCurrencySchema>
