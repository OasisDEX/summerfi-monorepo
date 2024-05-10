import { TokenData } from './TokensData'

/**
 * List of tokens
 */
export interface TokenListData {
  /** Name of the token list */
  name: string
  /** Timestamp when the token list was created */
  timestamp: string
  /** Version of the token list */
  version: {
    major: number
    minor: number
    patch: number
  }
  /** Tags of the token list */
  tags: Record<string, string>
  /** URI of the logo of the token list */
  logoURI: string
  /** Keywords of the token list */
  keywords: string[]
  /** List of tokens */
  tokens: TokenData[]
}
