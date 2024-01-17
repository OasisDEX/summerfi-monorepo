import { IToken, ITokenAmount } from "@sdk/common";

/**
 * @class TokenAmount
 * @see ITokenAmount
 */
export class TokenAmount implements ITokenAmount {
    /// Instance Attributes
    public readonly token: IToken;
    public readonly amount: string;

    /// Constructor
    private constructor(token: IToken, amount: string) {
        this.token = token;
        this.amount = amount;
    }

    /// Static Methods
    public static create(token: IToken, amount: string): TokenAmount {
        return new TokenAmount(token, amount);
    }

    /// Instance Methods

    /**
     * @see IPrintable.toString
     */
    public toString(): string {
        return `${this.amount} ${this.token.symbol}`;
    }
}
