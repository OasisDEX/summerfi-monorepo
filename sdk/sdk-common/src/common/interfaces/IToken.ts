import { z } from 'zod'
import { AddressDataSchema, IAddress } from './IAddress'
import { ChainInfoDataSchema, IChainInfo } from './IChainInfo'
import { IPrintable } from './IPrintable'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Represents an token in a Chain, typically used to represent ERC-20 tokens
 */
export interface IToken extends ITokenData, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
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
   * Checks if two tokens are equal
   *
   * @param token The token to compare
   * @returns true if the tokens are equal
   *
   * Equality is determined by the address and chain information
   */
  equals(token: IToken): boolean
}

/**
 * Zod schema for IToken
 */
export const TokenDataSchema = z.object({
  chainInfo: ChainInfoDataSchema,
  address: AddressDataSchema,
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

/**
 * Type for the data part of the IToken interface
 */
export type ITokenData = Readonly<z.infer<typeof TokenDataSchema>>

/**
 * Type guard for IToken
 *
 * @param maybeTokenData
 * @returns true if the object is an IToken
 */
export function isToken(maybeTokenData: unknown): maybeTokenData is IToken {
  return isTokenData(maybeTokenData)
}

/**
 * Type guard for ITokenData
 *
 * @param maybeTokenData
 * @returns true if the object is an ITokenData
 */
export function isTokenData(maybeTokenData: unknown): maybeTokenData is ITokenData {
  return TokenDataSchema.safeParse(maybeTokenData).success
}
