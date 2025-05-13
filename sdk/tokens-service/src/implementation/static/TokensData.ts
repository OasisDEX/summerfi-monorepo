import { AddressValue, type ChainId } from '@summerfi/sdk-common'

/**
 * Information of a token
 */
export interface TokenData {
  /** Full name of the token */
  name: string
  /** Address of the token */
  address: AddressValue
  /** Symbol of the token */
  symbol: string
  /** Number of decimals of the token */
  decimals: number
  /** Chain ID of the token */
  chainId: ChainId
  /** URI of the logo of the token */
  logoURI: string
}
