import { SerializationService } from '../../services/SerializationService'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

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

SerializationService.registerClass(Token)
