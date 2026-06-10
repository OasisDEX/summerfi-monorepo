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

  /**
   * Determines whether this chain refers to the same network as another.
   *
   * @param chainInfo - The other chain to compare against.
   * @returns `true` if both have the same chain id.
   */
  equals(chainInfo: ChainInfo): boolean {
    return this.chainId === chainInfo.chainId
  }

  /**
   * Returns a human-readable representation of the chain (its name and id).
   *
   * @returns A string in the form `"<name> (ID: <chainId>)"`.
   */
  toString(): string {
    return `${this.name} (ID: ${this.chainId})`
  }
}

SerializationService.registerClass(ChainInfo, { identifier: 'ChainInfo' })
