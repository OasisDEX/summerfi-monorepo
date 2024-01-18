import { Transaction } from "viem";

/**
 * @interface ITransactionInfo
 * @description Contains the low level transaction plus a description of what the transaction is for.
 *              This could be used to display the transaction to the user.
 */
export interface ITransactionInfo {
    transaction: Transaction;
    description: string;
}
