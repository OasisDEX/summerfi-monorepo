import { AddressSchema, IAddress, IAddressData } from './IAddress'
import { ChainInfoSchema, IChainInfo, IChainInfoData } from './IChainInfo'
import { IPrintable } from './IPrintable'
import { z } from 'zod'

/**
 * @name ITokenData
 * @description Represents a blockchain token
 *
 * Tokens are uniquely identified by their address and chain information
 */
export interface ITokenData {
  /** Chain where the token is deployed */
  readonly chainInfo: IChainInfoData
  /** Token address */
  readonly address: IAddressData
  /** Token symbol, usually a short representation of name and used in tickers */
  readonly symbol: string
  /** Full token name */
  readonly name: string
  /** Number of decimals for the token */
  readonly decimals: number
}

/**
 * @name IToken
 * @description Interface for the implementors of the token
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IToken extends ITokenData, IPrintable {
  readonly chainInfo: IChainInfo
  readonly address: IAddress
  readonly symbol: string
  readonly name: string
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
export const TokenSchema = z.object({
  chainInfo: ChainInfoSchema,
  address: AddressSchema,
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

/**
 * @description Type guard for IToken
 * @param maybeToken
 * @returns true if the object is an IToken
 */
export function isToken(maybeToken: unknown): maybeToken is ITokenData {
  return TokenSchema.safeParse(maybeToken).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ITokenData = {} as z.infer<typeof TokenSchema>
