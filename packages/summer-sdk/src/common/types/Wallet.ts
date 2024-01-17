import { IWallet } from "@sdk/common";
import { Address } from "./Address";

/**
 * @class Wallet
 * @see IWallet
 */
export class Wallet implements IWallet {
    /// Instance Attributes
    public readonly address: Address;

    /// Constructor
    private constructor(params: { address: string }) {
        this.address = Address.fromAddress(params.address);
    }

    /// Static Methods
    public static create(params: { address: string }): Wallet {
        return new Wallet(params);
    }

    /// Instance Methods

    /**
     * @see IPrintable.toString
     */
    public toString(): string {
        return `Wallet: ${this.address.toString()}`;
    }
}
