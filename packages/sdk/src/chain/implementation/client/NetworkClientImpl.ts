import {
  ProtocolsManager,
  ProtocolsManagerClientImpl,
  TokensManager,
  TokensManagerClientImpl,
} from '~sdk/managers'
import { Network, NetworkId } from '~sdk/network'
import { ChainBaseImpl } from '../base/ChainBaseImpl'

/**
 * @class Network
 * @see INetwork
 */
export class NetworkClientImpl extends ChainBaseImpl implements Network {
  /// Constructor

  private constructor(networkId: NetworkId) {
    super(
      networkId,
      TokensManagerClientImpl.getInstance(),
      ProtocolsManagerClientImpl.getInstance(),
    )
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
