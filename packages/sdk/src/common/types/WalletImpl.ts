import { Wallet } from "~sdk/common";
import { AddressImpl } from "./AddressImpl";

/**
 * @class Wallet
 * @see Wallet
 */
export class WalletImpl implements Wallet {
    /// Instance Attributes
    public readonly address: AddressImpl;

    /// Constructor
    private constructor(params: { address: string }) {
        this.address = AddressImpl.fromAddress(params.address);
    }

    /// Static Methods
    public static create(params: { address: string }): Wallet {
        return new WalletImpl(params);
    }

    /// Instance Methods

    /**
     * @see Printable.toString
     */
    public toString(): string {
        return `Wallet: ${this.address.toString()}`;
    }
}
