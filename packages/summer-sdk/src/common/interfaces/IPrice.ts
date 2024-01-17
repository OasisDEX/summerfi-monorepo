import { IPrintable } from "./IPrintable";
import { IToken } from "./IToken";

/**
 * @interface IPrice
 * @description Represents a price of a token (baseToken) in a given currency (quoteToken)
 */
export interface IPrice extends IPrintable {
    /** The amount of tokens in floating point format (i.e.: 123.98) */
    value: string;
    /** The token that the price is for */
    baseToken: IToken;
    /** The token that the price is in */
    quoteToken?: IToken;
}
