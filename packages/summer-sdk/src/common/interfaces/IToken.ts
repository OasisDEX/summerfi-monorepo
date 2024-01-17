import { IAddress } from "./IAddress";
import { NetworkId } from "../../network/interfaces/INetwork";
import { IPrintable } from "./IPrintable";

/**
 * @name IToken
 * @description Represents a token on a blockchain and provides information on the following info:
 *              - Network ID
 *              - Address
 *              - Symbol
 *              - Name
 *              - Decimals
 */
export interface IToken extends IPrintable {
    networkId: NetworkId;
    address: IAddress;
    symbol: string;
    name: string;
    decimals: number;
}
