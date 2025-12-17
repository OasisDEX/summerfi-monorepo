'use client'

import { useCallback, useState } from 'react'
import { AnimateHeight, Button, Card, Icon, Text, useUserWallet } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import clsx from 'clsx'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { SimpleTransactionButton } from '@/components/organisms/SimpleTransactionButton/SimpleTransactionButton'
import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'

import transactionQueueStyles from './TransactionQueue.module.css'

export const TransactionQueue = ({
  transactionQueue,
  removeTransaction,
  chainId,
}: {
  transactionQueue: SDKTransactionItem[]
  removeTransaction: (id: string) => void
  chainId: SupportedNetworkIds
}) => {
  const { userWalletAddress } = useUserWallet()
  const [transactionRemovedLocally, setTransactionRemovedLocally] = useState<SDKTransactionItem[]>(
    [],
  )

  const handleTransactionRemove = (id: string) => {
    // Animation handling - fade out before removing from the list
    const txToRemove = transactionQueue.find((tx) => tx.id === id)

    if (txToRemove) {
      setTransactionRemovedLocally((prev) => [...prev, txToRemove])
      setTimeout(() => {
        removeTransaction(id)
        setTransactionRemovedLocally((prev) => prev.filter((tx) => tx.id !== id))
      }, 600) // Duration should match the AnimateHeight transition duration
    }
  }

  const userConnected = !!userWalletAddress
  const getTxLabel = useCallback((txItem: SDKTransactionItem) => {
    if (!txItem.txDescription) return null

    return (
      <>
        {txItem.txLabel ? (
          <Text
            as="span"
            variant="p2semi"
            style={{
              color: {
                positive: 'var(--earn-protocol-success-50)',
                negative: 'var(--earn-protocol-critical-100)',
                neutral: 'var(--earn-protocol-secondary-70)',
              }[txItem.txLabel.charge],
            }}
          >
            {txItem.txLabel.label}&nbsp;
          </Text>
        ) : (
          ''
        )}
        {txItem.txDescription}&nbsp;
      </>
    )
  }, [])

  return (
    <Card className={transactionQueueStyles.cardWrapper}>
      <AnimateHeight
        id="transaction-queue-not-connected"
        show={!userConnected}
        keepChildrenRendered
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <WalletLabel />
        </div>
      </AnimateHeight>
      {transactionQueue.map((txItem) => (
        <AnimateHeight
          key={txItem.id}
          id={txItem.id}
          show={!transactionRemovedLocally.some((tx) => tx.id === txItem.id)}
          fade
        >
          <div
            className={clsx(transactionQueueStyles.transactionItem, {
              [transactionQueueStyles.transactionItemLast]:
                txItem === transactionQueue[transactionQueue.length - 1],
            })}
          >
            <Text as="p" variant="p2">
              {getTxLabel(txItem)}
            </Text>
            <div className={transactionQueueStyles.transactionActions}>
              <SimpleTransactionButton txItem={txItem} chainId={chainId} />
              <Button
                variant="textSecondarySmall"
                onClick={() => handleTransactionRemove(txItem.id)}
                style={{ marginLeft: 8 }}
                disabled={transactionRemovedLocally.some((tx) => tx.id === txItem.id)}
              >
                <Icon iconName="trash" size={14} />
              </Button>
            </div>
          </div>
        </AnimateHeight>
      ))}
      <AnimateHeight
        id="transaction-queue-no-items"
        show={transactionQueue.length === 0 && userConnected}
        keepChildrenRendered
        contentClassName={transactionQueueStyles.noTransactions}
      >
        <Icon
          iconName="search_icon"
          size={24}
          className={transactionQueueStyles.noTransactionsIcon}
        />
        <Text as="p" variant="p2">
          No transactions in the queue.
        </Text>
      </AnimateHeight>
    </Card>
  )
}
