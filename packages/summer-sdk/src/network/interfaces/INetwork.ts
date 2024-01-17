import { IPrintable } from "@sdk/common";

/**
 * @name NetworkId
 * @description Represents the ID of a network
 */
export type NetworkId = {
    /** The chain ID of the network */
    chainId: number;
    /** The name of the network */
    name: string;
};

/**
 * @interface INetwork
 * @description Represents a blockchain network and allows to access the tokens and protocols of the network
 */
export interface INetwork extends IPrintable {
    /** The ID of the network */
    networkId: NetworkId;
    /** The token manager for the network */
    tokens: any;
    /** The protocol manager for the network */
    protocols: any;
}
