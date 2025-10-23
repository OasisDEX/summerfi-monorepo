import { type ReactNode, useEffect, useState } from 'react'
import { type TransactionInfo } from '@summerfi/sdk-common'

export type SDKTransactionItem = {
  id: string
  txDescription: ReactNode
  txData?: TransactionInfo
  txError?: Error
  txLabel?: {
    label: string
    charge: 'positive' | 'negative' | 'neutral'
  }
}

export const useSDKTransactionQueue = () => {
  const [transactionQueue, setTransactionQueue] = useState<SDKTransactionItem[]>([])

  const addTransaction = async (item: SDKTransactionItem, txPromise: Promise<TransactionInfo>) => {
    const { id } = item
    // SWR style update in two steps
    // First is fast to update the UI
    // Second is async to update the TX

    setTransactionQueue((prevQueue) => [...prevQueue, item])
    await txPromise
      .then((txInfo) => {
        setTransactionQueue((prevQueue) =>
          prevQueue.map((txItem) => (txItem.id === id ? { ...txItem, txData: txInfo } : txItem)),
        )
      })
      .catch((error) => {
        setTransactionQueue((prevQueue) =>
          prevQueue.map((txItem) => (txItem.id === id ? { ...txItem, txError: error } : txItem)),
        )
      })
  }

  const removeTransaction = (id: string) => {
    setTransactionQueue((prevQueue) => prevQueue.filter((item) => item.id !== id))
  }

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Transaction Queue Updated:', transactionQueue)
  }, [transactionQueue])

  return {
    transactionQueue,
    addTransaction,
    removeTransaction,
  }
}
