import { SerializationService } from '../../services/SerializationService'
import { ChainId } from '../aliases/ChainId'

export type IChainInfoSerialized = {
  /** The chain ID of the network */
  chainId: ChainId
  /** The name of the network */
  name: string
}

/**
 * @name ChainInfo
 * @description Provides information of a blockchain network
 */
export class ChainInfo implements IChainInfoSerialized {
  readonly chainId: ChainId
  readonly name: string

  private constructor(params: IChainInfoSerialized) {
    this.chainId = params.chainId
    this.name = params.name
  }

  static createFrom(params: IChainInfoSerialized): ChainInfo {
    return new ChainInfo(params)
  }

  toString(): string {
    return `${this.name} (ID: ${this.chainId})`
  }
}

SerializationService.registerClass(ChainInfo)
