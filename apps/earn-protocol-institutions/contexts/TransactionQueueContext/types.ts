import { type SupportedNetworkIds } from '@summerfi/app-types'
import { type TransactionInfo } from '@summerfi/sdk-common'

/**
 * A queued transaction. Must stay JSON-serializable (it is persisted to
 * localStorage): `txDescription` is a plain string (NOT a React node) and
 * `txError` is a plain `{ message }` (NOT an Error instance).
 */
export interface SDKTransactionItem {
  id: string
  txDescription: string
  txData?: TransactionInfo
  txError?: { message: string }
  txInitialState?: 'idle' | 'txSuccess'
  txLabel?: {
    label: string
    charge: 'positive' | 'negative' | 'neutral'
  }
  /** Target chain. Drives chain grouping and execution. */
  chainId: SupportedNetworkIds
  /** Target vault (display only; the list can span vaults). */
  vaultAddress?: string
  /** Cache tags to revalidate on success. Precomputed by the producing panel. */
  revalidateTags?: string[]
  /** Insertion timestamp (display/order only; no auto-expiry). */
  createdAt?: number
}

export interface TransactionQueueContextValue {
  transactionQueue: SDKTransactionItem[]
  addTransaction: (
    item: SDKTransactionItem,
    transaction?: Promise<TransactionInfo> | TransactionInfo,
  ) => Promise<void>
  updateTransaction: (id: string, updatedItem: Partial<SDKTransactionItem>) => void
  removeTransaction: (id: string) => void
}
