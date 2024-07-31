import { SerializationService } from '../../services/SerializationService'
import { ChainId } from '../aliases/ChainId'
import { IChainInfo, IChainInfoParameters, __ichaininfo__ } from '../interfaces/IChainInfo'

/**
 * @name ChainInfo
 * @see IChainInfo
 */
export class ChainInfo implements IChainInfo {
  /** SIGNATURE */
  readonly [__ichaininfo__] = 'IChainInfo'

  /** ATTRIBUTES */
  readonly chainId: ChainId
  readonly name: string

  /** FACTORY METHODS */
  static createFrom(params: IChainInfoParameters): ChainInfo {
    return new ChainInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IChainInfoParameters) {
    this.chainId = params.chainId
    this.name = params.name
  }

  equals(chainInfo: ChainInfo): boolean {
    return this.chainId === chainInfo.chainId
  }

  toString(): string {
    return `${this.name} (ID: ${this.chainId})`
  }
}

SerializationService.registerClass(ChainInfo)
