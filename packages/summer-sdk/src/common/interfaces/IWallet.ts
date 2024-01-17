import { IAddress } from "./IAddress";
import { IPrintable } from "./IPrintable";

/**
 * @interface IWallet
 * @description Represents a wallet on a blockchain
 */
export interface IWallet extends IPrintable {
    address: IAddress;
}
