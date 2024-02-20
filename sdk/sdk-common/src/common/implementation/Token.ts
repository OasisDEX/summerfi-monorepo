import { ChainInfo } from '~sdk-common/chains'
import { Address } from './Address'
import { Printable } from './Printable'

// create serialized type
export interface TokenSerialized {
  chainInfo: ChainInfo
  address: Address
  symbol: string
  name: string
  decimals: number
}

/**
 * @name Token
 * @description Represents a token on a blockchain and provides information on the following info:
 *              - ChainInfo
 *              - Address
 *              - Symbol
 *              - Name
 *              - Decimals
 */
export class Token implements Printable {
  public readonly chainInfo: ChainInfo
  public readonly address: Address
  public readonly symbol: string
  public readonly name: string
  public readonly decimals: number

  private constructor(params: {
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

  static createFrom(params: {
    chainInfo: ChainInfo
    address: Address
    symbol: string
    name: string
    decimals: number
  }): Token {
    return new Token(params)
  }

  deserialize(params: TokenSerialized): Token {
    return new Token({
      chainInfo: params.chainInfo,
      address: params.address,
      symbol: params.symbol,
      name: params.name,
      decimals: params.decimals,
    })
  }

  toString(): string {
    return `${this.symbol} (${this.name})`
  }

  serialize(): TokenSerialized {
    return {
      chainInfo: this.chainInfo,
      address: this.address,
      symbol: this.symbol,
      name: this.name,
      decimals: this.decimals,
    }
  }
}
