import { IToken } from '../interfaces/IToken'
import { SerializationService } from '../../services/SerializationService'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name Token
 * @see IToken
 */
export class Token implements IToken {
  readonly chainInfo: ChainInfo
  readonly address: Address
  readonly symbol: string
  readonly name: string
  readonly decimals: number

  private constructor(params: IToken) {
    this.chainInfo = params.chainInfo
    this.address = Address.createFromEthereum(params.address)
    this.symbol = params.symbol
    this.name = params.name
    this.decimals = params.decimals
  }

  static createFrom(params: IToken): Token {
    return new Token(params)
  }

  toString(): string {
    return `${this.symbol} (${this.name})`
  }
}

SerializationService.registerClass(Token)
