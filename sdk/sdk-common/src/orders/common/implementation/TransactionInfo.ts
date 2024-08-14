import { HexData } from '@summerfi/sdk-common/common/aliases'
import { Address } from '../../../common/implementation/Address'

/**
 * @interface Transaction
 * @description Low level transaction that can be sent to the blockchain
 */
export type Transaction = {
  target: Address
  calldata: HexData
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
