import { IChainInfo, IChainInfoData } from '../interfaces/IChainInfo'
import { SerializationService } from '../../services/SerializationService'
import { ChainId } from '../aliases/ChainId'

/**
 * @name ChainInfo
 * @see IChainInfo
 */
export class ChainInfo implements IChainInfo {
  readonly chainId: ChainId
  readonly name: string

  /** Factory method */
  static createFrom(params: IChainInfoData): ChainInfo {
    return new ChainInfo(params)
  }

  /** Sealed constructor */
  private constructor(params: IChainInfoData) {
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
