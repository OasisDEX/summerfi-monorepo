import { Token, TokenAmount } from "~sdk/common";

/**
 * @class TokenAmount
 * @see TokenAmount
 */
export class TokenAmountImpl implements TokenAmount {
    /// Instance Attributes
    public readonly token: Token;
    public readonly amount: string;

    /// Constructor
    private constructor(token: Token, amount: string) {
        this.token = token;
        this.amount = amount;
    }

    /// Static Methods
    public static create(token: Token, amount: string): TokenAmount {
        return new TokenAmountImpl(token, amount);
    }

    /// Instance Methods

    /**
     * @see Printable.toString
     */
    public toString(): string {
        return `${this.amount} ${this.token.symbol}`;
    }
}
