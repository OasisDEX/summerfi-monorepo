import { IChainInfo } from '../interfaces/IChainInfo'
import { SerializationService } from '../../services/SerializationService'
import { ChainId } from '../aliases/ChainId'

/**
 * @name ChainInfo
 * @description Provides information of a blockchain network
 */
export class ChainInfo implements IChainInfo {
  readonly chainId: ChainId
  readonly name: string

  constructor(params: IChainInfo) {
    this.chainId = params.chainId
    this.name = params.name
  }

  static createFrom(params: IChainInfo): ChainInfo {
    return new ChainInfo(params)
  }

  toString(): string {
    return `${this.name} (ID: ${this.chainId})`
  }
}

SerializationService.registerClass(ChainInfo)
