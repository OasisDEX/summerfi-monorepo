'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { type TransactionInfo } from '@summerfi/sdk-common'
import { useParams } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext/AuthContext'
import {
  getPartitionKey,
  loadPartition,
  savePartition,
} from '@/contexts/TransactionQueueContext/storage'
import {
  type SDKTransactionItem,
  type TransactionQueueContextValue,
} from '@/contexts/TransactionQueueContext/types'

const TransactionQueueContext = createContext<TransactionQueueContextValue | undefined>(undefined)

export function TransactionQueueProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const params = useParams()
  const institutionName =
    typeof params.institutionName === 'string' ? params.institutionName : undefined
  const userId = user?.id

  const partitionKey = getPartitionKey({ institutionName, userId })

  // In-memory map of every partition touched this session. Keeps in-flight tx
  // preparation alive across navigation (the provider never unmounts) and avoids a
  // partition switch clobbering a resolving promise from another partition.
  const [partitions, setPartitions] = useState<{ [key: string]: SDKTransactionItem[] }>({})

  // Lazy-load the active partition from localStorage the first time it is seen.
  useEffect(() => {
    if (!partitionKey) return
    setPartitions((prev) => {
      if (partitionKey in prev) return prev

      return { ...prev, [partitionKey]: loadPartition(partitionKey) }
    })
  }, [partitionKey])

  // All mutations go through here so every change persists to its own slot.
  const updatePartition = useCallback(
    (key: string, updater: (items: SDKTransactionItem[]) => SDKTransactionItem[]) => {
      setPartitions((prev) => {
        const next = updater(prev[key] ?? [])

        savePartition(key, next)

        return { ...prev, [key]: next }
      })
    },
    [],
  )

  const addTransaction = useCallback(
    async (item: SDKTransactionItem, transaction?: Promise<TransactionInfo> | TransactionInfo) => {
      const key = partitionKey

      if (!key) return

      const { id } = item

      // Dedup by id: replace an existing item rather than appending a duplicate.
      updatePartition(key, (items) => [
        ...items.filter((existing) => existing.id !== id),
        { ...item, createdAt: item.createdAt ?? Date.now() },
      ])

      if (!transaction) return

      if (!(transaction instanceof Promise)) {
        updatePartition(key, (items) =>
          items.map((txItem) => (txItem.id === id ? { ...txItem, txData: transaction } : txItem)),
        )

        return
      }

      try {
        const txInfo = await transaction

        updatePartition(key, (items) =>
          items.map((txItem) => (txItem.id === id ? { ...txItem, txData: txInfo } : txItem)),
        )
      } catch (error) {
        updatePartition(key, (items) =>
          items.map((txItem) =>
            txItem.id === id
              ? {
                  ...txItem,
                  txError: { message: error instanceof Error ? error.message : String(error) },
                }
              : txItem,
          ),
        )
      }
    },
    [partitionKey, updatePartition],
  )

  const updateTransaction = useCallback(
    (id: string, updatedItem: Partial<SDKTransactionItem>) => {
      if (!partitionKey) return
      updatePartition(partitionKey, (items) =>
        items.map((txItem) => (txItem.id === id ? { ...txItem, ...updatedItem } : txItem)),
      )
    },
    [partitionKey, updatePartition],
  )

  const removeTransaction = useCallback(
    (id: string) => {
      if (!partitionKey) return
      updatePartition(partitionKey, (items) => items.filter((item) => item.id !== id))
    },
    [partitionKey, updatePartition],
  )

  const value = useMemo<TransactionQueueContextValue>(
    () => ({
      transactionQueue: partitionKey ? (partitions[partitionKey] ?? []) : [],
      addTransaction,
      updateTransaction,
      removeTransaction,
    }),
    [partitionKey, partitions, addTransaction, updateTransaction, removeTransaction],
  )

  return (
    <TransactionQueueContext.Provider value={value}>{children}</TransactionQueueContext.Provider>
  )
}

export const useTransactionQueue = (): TransactionQueueContextValue => {
  const context = useContext(TransactionQueueContext)

  if (context === undefined) {
    throw new Error('useTransactionQueue must be used within a TransactionQueueProvider')
  }

  return context
}
