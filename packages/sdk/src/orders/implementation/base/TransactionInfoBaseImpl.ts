import { Transaction } from 'viem'
import { TransactionInfo } from '~sdk/orders'

export class TransactionInfoBaseImpl implements TransactionInfo {
  public readonly transaction: Transaction
  public readonly description: string

  public constructor(params: { transaction: Transaction; description: string }) {
    this.transaction = params.transaction
    this.description = params.description
  }
}
