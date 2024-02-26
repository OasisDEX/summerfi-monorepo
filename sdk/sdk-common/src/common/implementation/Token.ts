import { type ChainInfo, type Address } from '~sdk-common/common/implementation'
import { SerializationManager } from '~sdk-common/common/managers'

interface ITokenSerialized {
  chainInfo: ChainInfo
  address: Address
  symbol: string
  name: string
  decimals: number
}

/**
 * @name Token
 * @description Represents a token on a blockchain and provides it's details
 */
export class Token implements ITokenSerialized {
  readonly chainInfo: ChainInfo
  readonly address: Address
  readonly symbol: string
  readonly name: string
  readonly decimals: number

  private constructor(params: ITokenSerialized) {
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

  toString(): string {
    return `${this.symbol} (${this.name})`
  }
}

SerializationManager.registerClass(Token)
