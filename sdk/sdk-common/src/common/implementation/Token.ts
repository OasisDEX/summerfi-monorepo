import { SerializationService } from '../../services/SerializationService'
import { IToken, ITokenParameters } from '../interfaces/IToken'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name Token
 * @see IToken
 */
export class Token implements IToken {
  readonly _signature_0 = 'IToken'

  readonly chainInfo: ChainInfo
  readonly address: Address
  readonly symbol: string
  readonly name: string
  readonly decimals: number

  /** Factory method */
  static createFrom(params: ITokenParameters): Token {
    return new Token(params)
  }

  /** Sealed constructor */
  private constructor(params: ITokenParameters) {
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
    this.address = Address.createFromEthereum(params.address)
    this.symbol = params.symbol
    this.name = params.name
    this.decimals = params.decimals
  }

  equals(token: Token): boolean {
    return this.chainInfo.equals(token.chainInfo) && this.address.equals(token.address)
  }

  toString(): string {
    return `${this.symbol} (${this.name})`
  }
}

SerializationService.registerClass(Token)
