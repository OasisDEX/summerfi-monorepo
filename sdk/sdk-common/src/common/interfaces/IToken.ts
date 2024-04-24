import { AddressSchema, IAddress } from './IAddress'
import { ChainInfoSchema, IChainInfo } from './IChainInfo'
import { z } from 'zod'

/**
 * @name IToken
 * @description Represents a blockchain token
 *
 * Tokens are uniquely identified by their address and chain information
 */
export interface IToken {
  chainInfo: IChainInfo
  address: IAddress
  symbol: string
  name: string
  decimals: number
}

/**
 * @description Type guard for IToken
 * @param maybeToken
 * @returns true if the object is an IToken
 */
export function isToken(maybeToken: unknown): maybeToken is IToken {
  return (
    typeof maybeToken === 'object' &&
    maybeToken !== null &&
    'chainInfo' in maybeToken &&
    'address' in maybeToken &&
    'symbol' in maybeToken &&
    'name' in maybeToken &&
    'decimals' in maybeToken
  )
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
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IToken = {} as z.infer<typeof TokenSchema>
