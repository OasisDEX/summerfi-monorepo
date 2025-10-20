import { useEffect, useState } from 'react'

export type SDKTransactionItem = {
  id: string
  txDescription: string
  txData: string
}

export const useSDKTransactionQueue = () => {
  const [transactionQueue, setTransactionQueue] = useState<SDKTransactionItem[]>([])

  const addTransaction = (item: SDKTransactionItem) => {
    setTransactionQueue((prevQueue) => [...prevQueue, item])
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
