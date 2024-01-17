import { IAddress, AddressType } from "@sdk/common";

/**
 * @class Address
 * @see IAddress
 */
export class Address implements IAddress {
    /// Instance Attributes
    public readonly address: string;
    public readonly type: AddressType;

    /// Constructor

    private constructor(address: string, type: AddressType) {
        this.address = address;
        this.type = type;
    }

    /// Static Methods

    /**
     *
     * @param address A string representation of the address
     * @returns An instance of Address with the correct type
     */
    public static fromAddress(address: string): Address {
        if (this.isValid(address) === false) {
            throw new Error("Address type is unknown");
        }

        const type = this.getType(address);

        return new Address(address, type);
    }

    /**
     * @param address A string representation of the address
     * @returns Whether the address is a known format or not
     */
    public static isValid(address: string): boolean {
        const type = this.getType(address);
        return type !== AddressType.Unknown;
    }

    /**
     * @param address A string representation of the address
     * @returns The type of the address
     */
    public static getType(address: string): AddressType {
        if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return AddressType.Ethereum;
        }
        return AddressType.Unknown;
    }

    /// Instance Methods

    /**
     * @see IPrintable.toString
     */
    public toString(): string {
        return `${this.address} (${this.type})`;
    }
}
