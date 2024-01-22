import { ChainInfo } from '~sdk/chain'
import { Address } from './Address'
import { Printable } from './Printable'

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

  public static createFrom(params: {
    chainInfo: ChainInfo
    address: Address
    symbol: string
    name: string
    decimals: number
  }): Token {
    return new Token(params)
  }

  public toString(): string {
    return `${this.symbol} (${this.name})`
  }
}
