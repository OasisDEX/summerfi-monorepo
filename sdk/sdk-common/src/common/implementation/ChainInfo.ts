import { type ChainId } from '~sdk-common/common/aliases'
import { Address } from '~sdk-common/common/implementation'
import { SerializationService } from '~sdk-common/common/services'

export const address: Address = Address.createFrom({
  hexValue: '0x0000000000000000000000000000000000000000',
})
//
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
