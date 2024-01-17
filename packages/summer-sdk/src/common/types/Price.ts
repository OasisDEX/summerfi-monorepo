import { IPrice, IToken } from "@sdk/common/interfaces";

/**
 * @class Price
 * @see IPrice
 */
export class Price implements IPrice {
    /// Instance Attributes
    public readonly value: string;
    public readonly baseToken: IToken;
    public readonly quoteToken?: IToken;

    /// Constructor
    private constructor(params: { value: string; baseToken: IToken; quoteToken?: IToken }) {
        this.value = params.value;
        this.baseToken = params.baseToken;
        this.quoteToken = params.quoteToken;
    }

    /// Static Methods
    from(params: { value: string; baseToken: IToken; quoteToken?: IToken }): Price {
        return new Price(params);
    }

    /// Instance Methods

    /**
     * @see IPrintable.toString
     */
    public toString(): string {
        return `${this.value} ${this.baseToken.symbol}/${this.quoteToken ? this.quoteToken.symbol : "USD"}`;
    }
}
