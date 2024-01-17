import { Transaction } from "viem";
import { ITransactionInfo } from "../interfaces/ITransactionInfo";

export class TransactionInfo implements ITransactionInfo {
    /// Instance Attributes
    public readonly transaction: Transaction;
    public readonly description: string;

    /// Constructor
    public constructor(params: { transaction: Transaction; description: string }) {
        this.transaction = params.transaction;
        this.description = params.description;
    }
}
