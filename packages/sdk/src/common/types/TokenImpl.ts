import { Address, Token } from "~sdk/common";
import { NetworkId } from "~sdk/network";

/**
 * @class Token
 * @see Token
 */
export class TokenImpl implements Token {
    /// Instance Attributes
    public readonly networkId: NetworkId;
    public readonly address: Address;
    public readonly symbol: string;
    public readonly name: string;
    public readonly decimals: number;

    /// Constructor
    private constructor(params: {
        networkId: NetworkId;
        address: Address;
        symbol: string;
        name: string;
        decimals: number;
    }) {
        this.networkId = params.networkId;
        this.address = params.address;
        this.symbol = params.symbol;
        this.name = params.name;
        this.decimals = params.decimals;
    }

    /// Static Methods
    public static from(params: {
        networkId: NetworkId;
        address: Address;
        symbol: string;
        name: string;
        decimals: number;
    }): Token {
        return new TokenImpl(params);
    }
}
