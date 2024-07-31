import { SerializationService } from '../../services/SerializationService'
import { IAddress } from '../interfaces/IAddress'
import { IChainInfo } from '../interfaces/IChainInfo'
import { IToken, ITokenParameters, __itoken__ } from '../interfaces/IToken'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name Token
 * @see IToken
 */
export class Token implements IToken {
  /** SIGNATURE */
  readonly [__itoken__] = 'IToken'

  /** ATTRIBUTES */
  readonly chainInfo: IChainInfo
  readonly address: IAddress
  readonly symbol: string
  readonly name: string
  readonly decimals: number

  /** FACTORY */
  static createFrom(params: ITokenParameters): Token {
    return new Token(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ITokenParameters) {
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
    this.address = Address.createFromEthereum(params.address)
    this.symbol = params.symbol
    this.name = params.name
    this.decimals = params.decimals
  }

  /** METHODS */

  /** @see IToken.equals */
  equals(token: Token): boolean {
    return this.chainInfo.equals(token.chainInfo) && this.address.equals(token.address)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.symbol} (${this.name})`
  }
}

SerializationService.registerClass(Token)
