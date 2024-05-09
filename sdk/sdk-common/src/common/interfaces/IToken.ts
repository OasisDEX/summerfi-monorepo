import { AddressDataSchema, IAddress } from './IAddress'
import { ChainInfoDataSchema, IChainInfo } from './IChainInfo'
import { IPrintable } from './IPrintable'
import { z } from 'zod'

/**
 * @name IToken
 * @description Interface for the implementors of the token
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IToken extends ITokenData, IPrintable {
  /** Chain where the token is deployed */
  readonly chainInfo: IChainInfo
  /** Token address */
  readonly address: IAddress
  /** Token symbol, usually a short representation of name and used in tickers */
  readonly symbol: string
  /** Full token name */
  readonly name: string
  /** Number of decimals for the token */
  readonly decimals: number

  /**
   * @name equals
   * @description Checks if two tokens are equal
   * @param token The token to compare
   * @returns true if the tokens are equal
   *
   * Equality is determined by the address and chain information
   */
  equals(token: IToken): boolean
}

/**
 * @description Zod schema for IToken
 */
export const TokenDataSchema = z.object({
  chainInfo: ChainInfoDataSchema,
  address: AddressDataSchema,
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

/**/
export type ITokenData = Readonly<z.infer<typeof TokenDataSchema>>

/**
 * @description Type guard for IToken
 * @param maybeTokenData
 * @returns true if the object is an IToken
 */
export function isToken(maybeTokenData: unknown): maybeTokenData is ITokenData {
  return TokenDataSchema.safeParse(maybeTokenData).success
}
