import { Address, Token } from '~sdk/common'
import { ChainInfo } from '~sdk/chain'

/**
 * @class Token
 * @see Token
 */
export class TokenBaseImpl implements Token {
  public readonly chainInfo: ChainInfo
  public readonly address: Address
  public readonly symbol: string
  public readonly name: string
  public readonly decimals: number

  constructor(params: {
    chainInfo: ChainInfo
    address: Address
    symbol: string
    name: string
    decimals: number
  }) {
    this.chainInfo = params.chainInfo
    this.address = params.address
    this.symbol = params.symbol
    this.name = params.name
    this.decimals = params.decimals
  }

  public static from(params: {
    chainInfo: ChainInfo
    address: Address
    symbol: string
    name: string
    decimals: number
  }): Token {
    return new TokenBaseImpl(params)
  }
}
