import { SerializationService } from '../../services/SerializationService'
import { IAddress } from '../interfaces/IAddress'
import { IChainInfo } from '../interfaces/IChainInfo'
import { IToken, ITokenData, __signature__ } from '../interfaces/IToken'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * Type for the parameters of Token
 */
export type TokenParameters = Omit<ITokenData, ''>

/**
 * @name Token
 * @see IToken
 */
export class Token implements IToken {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly symbol: string
  readonly name: string
  readonly chainInfo: IChainInfo
  readonly address: IAddress
  readonly decimals: number

  /** FACTORY */
  static createFrom(params: TokenParameters): Token {
    return new Token(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: TokenParameters) {
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

SerializationService.registerClass(Token, { identifier: 'Token' })
