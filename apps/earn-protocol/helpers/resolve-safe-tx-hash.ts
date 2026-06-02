import { type Dispatch, type SetStateAction } from 'react'
import { getSafeTxHash } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks, type TransactionWithStatus } from '@summerfi/app-types'

type ResolveSafeTxHashParams = {
  // The hash returned by the wallet (the AA op hash, or the Safe tx hash).
  hash: `0x${string}`
  network: SupportedSDKNetworks
  nextTransaction?: TransactionWithStatus
  setWaitingForTx: Dispatch<SetStateAction<`0x${string}` | undefined>>
  setTransactions: Dispatch<SetStateAction<TransactionWithStatus[] | undefined>>
}

/**
 * When a transaction is sent through a Safe, the wallet hash is not the on-chain
 * tx hash. This resolves the real on-chain hash (falling back to the original hash
 * when the tx is not a Safe tx), marks it as the one to wait for, and stamps it onto
 * the matching pending transaction so the executor can track it.
 *
 * Extracted verbatim from the two call sites in `use-transaction` (the send hook's
 * onSuccess and the Safe-wallet send path) which previously duplicated this logic.
 */
export const resolveSafeTxHashAndStamp = async ({
  hash,
  network,
  nextTransaction,
  setWaitingForTx,
  setTransactions,
}: ResolveSafeTxHashParams) => {
  try {
    const safeTransactionData = await getSafeTxHash(hash, network)

    if (!safeTransactionData) {
      // not a safe transaction, proceed with the original hash
      setWaitingForTx(hash)

      return
    }

    if (safeTransactionData.transactionHash) {
      setWaitingForTx(safeTransactionData.transactionHash)
    }
    if (nextTransaction) {
      setTransactions((prev) =>
        prev?.map((tx) =>
          !tx.executed && !tx.txHash && tx.type === nextTransaction.type
            ? { ...tx, txHash: safeTransactionData.transactionHash }
            : tx,
        ),
      )
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error getting the safe tx hash:', err)
  }
}
