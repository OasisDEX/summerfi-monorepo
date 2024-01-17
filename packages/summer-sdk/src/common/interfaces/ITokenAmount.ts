import { IPrintable } from "./IPrintable";
import { IToken } from "./IToken";

/**
 * @interface ITokenAmount
 * @description Represents an amount of a certain token. The amount is represented as a string to avoid
 *              issues with big number representation. The token gives enough information to parse it into
 *              a big number.
 */
export interface ITokenAmount extends IPrintable {
    token: IToken;
    amount: string;
}
