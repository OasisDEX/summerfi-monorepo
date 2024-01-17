import { IPrintable } from "./IPrintable";

/**
 * @enum AddressType
 * @description Represents the type of a blockchain address
 */
export enum AddressType {
    Unknown = "Unknown",
    Ethereum = "Ethereum",
}

/**
 * @interface IAddress
 * @description Represents a blockchain address
 */
export interface IAddress extends IPrintable {
    address: string;
    type: AddressType;
}
