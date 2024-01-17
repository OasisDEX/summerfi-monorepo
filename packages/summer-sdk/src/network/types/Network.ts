import { INetwork, NetworkId } from "@sdk/common";

/**
 * @class Network
 * @see INetwork
 */
export class Network implements INetwork {
    /// Instance Attributes
    public readonly networkId: NetworkId;
    public readonly tokens: any;
    public readonly protocols: any;

    /// Constructor

    private constructor(networkId: NetworkId) {
        this.networkId = networkId;
    }

    /// Static Methods

    /**
     *
     * @param networkId
     * @returns
     */
    public static getNetwork(networkId: NetworkId): Network {
        return new Network(networkId);
    }

    /// Instance methods

    /**
     * @see INetwork.getLatestBlock
     */
    public getLatestBlock(): Promise<any> {
        // TODO: Implement
        return Promise.resolve();
    }

    /**
     * @see Inetwork.getBlock
     */
    public getBlock(): Promise<any> {
        // TODO: Implement
        return Promise.resolve();
    }

    /**
     * @see IPrintable.toString
     */
    public toString(): string {
        return `${this.networkId.name} (ID: ${this.networkId.chainId})`;
    }
}
