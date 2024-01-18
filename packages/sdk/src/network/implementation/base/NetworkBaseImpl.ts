import { Network, NetworkId } from '~sdk/network'

/**
 * @class Network
 * @see INetwork
 */
export class NetworkBaseImpl implements Network {
  /// Instance Attributes
  public readonly networkId: NetworkId
  public readonly tokens: any
  public readonly protocols: any

  /// Constructor

  private constructor(networkId: NetworkId) {
    this.networkId = networkId
  }

  /// Static Methods

  /**
   *
   * @param networkId
   * @returns
   */
  public static getNetwork(networkId: NetworkId): Network {
    return new NetworkBaseImpl(networkId)
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
