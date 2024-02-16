import { Hex } from 'viem'
import { Address } from '~sdk/common'

/**
 * @interface Transaction
 * @description Low level transaction that can be sent to the blockchain
 */
export type Transaction = {
  target: Address
  calldata: Hex
  value: string
}

/**
 * @interface TransactionInfo
 * @description Contains the low level transaction plus a description of what the transaction is for.
 *              This could be used to display the transaction to the user.
 */
export interface TransactionInfo {
  /** @description Low level transaction that can be sent to the blockchain */
  transaction: Transaction
  /** @description High-level description of the transaction */
  description: string
}
