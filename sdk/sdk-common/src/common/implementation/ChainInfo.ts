import { SerializationService } from '../../services/SerializationService'
import { ChainId } from '../types/ChainId'
import { IChainInfo, IChainInfoData, __signature__ } from '../interfaces/IChainInfo'

/**
 * Type for the parameters of ChainInfo
 */
export type ChainInfoParameters = Omit<IChainInfoData, ''>

/**
 * @name ChainInfo
 * @see IChainInfo
 */
export class ChainInfo implements IChainInfo {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly chainId: ChainId
  readonly name: string

  /** FACTORY METHODS */
  static createFrom(params: ChainInfoParameters): ChainInfo {
    return new ChainInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ChainInfoParameters) {
    this.chainId = params.chainId as ChainId
    this.name = params.name
  }

  equals(chainInfo: ChainInfo): boolean {
    return this.chainId === chainInfo.chainId
  }

  toString(): string {
    return `${this.name} (ID: ${this.chainId})`
  }
}

SerializationService.registerClass(ChainInfo, { identifier: 'ChainInfo' })
