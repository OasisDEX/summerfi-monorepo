import { ProtocolsManager, TokensManager } from '~sdk/managers'
import { Network, NetworkId } from '~sdk/network'

/**
 * @class NetworkBaseImpl
 * @description Base implementation of the Network interface, it holds common functionality like attributes assignment
 * @see Network
 */
export abstract class NetworkBaseImpl implements Network {
  /// Instance Attributes
  public readonly networkId: NetworkId
  public readonly tokens: TokensManager
  public readonly protocols: ProtocolsManager

  /// Constructor

  constructor(networkId: NetworkId, tokens: TokensManager, protocols: ProtocolsManager) {
    this.networkId = networkId
    this.tokens = tokens
    this.protocols = protocols
  }

  /// Instance methods

  /**
   * @see INetwork.getLatestBlock
   */
  public getLatestBlock() {
    // TODO: Implement
  }

  /**
   * @see Inetwork.getBlock
   */
  public getBlock() {
    // TODO: Implement
  }

  /**
   * @see Printable.toString
   */
  public toString(): string {
    return `${this.networkId.name} (ID: ${this.networkId.chainId})`
  }
}
