'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  AnimateHeight,
  Button,
  Card,
  getEarnProtocolChainById,
  Icon,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { formatAddress, sdkChainIdToHumanNetwork } from '@summerfi/app-utils'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { ExportToSafeButton } from '@/components/organisms/ExportToSafe/ExportToSafeButton'
import { isExportable } from '@/components/organisms/ExportToSafe/toSafeBatch'
import { SimpleTransactionButton } from '@/components/organisms/SimpleTransactionButton/SimpleTransactionButton'
import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { type SDKTransactionItem } from '@/contexts/TransactionQueueContext/types'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'

import transactionQueueStyles from './TransactionQueue.module.css'

export const TransactionQueue = ({
  onLocalTxSuccess,
  isLoading,
}: {
  /** Ephemeral, panel-local success side effect (refetch/reset). Durable cache
   *  revalidation always rides on the item's `revalidateTags`. */
  onLocalTxSuccess?: (txId: string) => void
  isLoading?: boolean
}) => {
  const { transactionQueue, removeTransaction } = useTransactionQueue()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { chain, isSettingChain, setChain } = useEarnProtocolChain()
  const { revalidateTags } = useRevalidateTags()
  const [transactionRemovedLocally, setTransactionRemovedLocally] = useState<SDKTransactionItem[]>(
    [],
  )

  const userConnected = !!userWalletAddress

  const switchToChain = useCallback(
    (chainId: SupportedNetworkIds) => {
      setChain({ chain: getEarnProtocolChainById(chainId) })
    },
    [setChain],
  )

  const handleTransactionRemove = useCallback(
    (id: string) => {
      const txToRemove = transactionQueue.find((tx) => tx.id === id)

      if (txToRemove) {
        setTransactionRemovedLocally((prev) => [...prev, txToRemove])
        setTimeout(() => {
          removeTransaction(id)
          setTransactionRemovedLocally((prev) => prev.filter((tx) => tx.id !== id))
        }, 600) // Matches the AnimateHeight transition duration
      }
    },
    [removeTransaction, transactionQueue],
  )

  const handleTxSuccess = useCallback(
    (item: SDKTransactionItem) => (txId: string) => {
      // Durable: bust the item's cache tags (works even though the producing panel
      // may be unmounted). revalidateTags() also calls router.refresh().
      if (item.revalidateTags && item.revalidateTags.length > 0) {
        revalidateTags({ tags: item.revalidateTags })
      }
      // Ephemeral: panel-local refetch/reset, only if that panel is mounted.
      onLocalTxSuccess?.(txId)
    },
    [revalidateTags, onLocalTxSuccess],
  )

  const getTxLabel = useCallback((txItem: SDKTransactionItem) => {
    if (!txItem.txDescription) return null

    return (
      <>
        {txItem.txLabel ? (
          <Text
            as="span"
            variant="p3semi"
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

  // Group items by chain. Connected chain first, then by first-added.
  const chainGroups = useMemo(() => {
    const byChain = new Map<SupportedNetworkIds, SDKTransactionItem[]>()

    for (const item of transactionQueue) {
      byChain.set(item.chainId, [...(byChain.get(item.chainId) ?? []), item])
    }

    return [...byChain.entries()]
      .map(([chainId, items]) => ({ chainId, items }))
      .sort((a, b) => {
        if (a.chainId === chain.id) return -1
        if (b.chainId === chain.id) return 1

        return (a.items[0]?.createdAt ?? 0) - (b.items[0]?.createdAt ?? 0)
      })
  }, [transactionQueue, chain.id])

  const isMultiChain = chainGroups.length > 1

  const renderRow = (txItem: SDKTransactionItem, isLast: boolean, onWrongChain: boolean) => (
    <AnimateHeight
      key={txItem.id}
      id={txItem.id}
      show={!transactionRemovedLocally.some((tx) => tx.id === txItem.id)}
      fade
    >
      <div
        className={clsx(transactionQueueStyles.transactionItem, {
          [transactionQueueStyles.transactionItemLast]: isLast,
        })}
      >
        <Text as="p" variant="p3" className={transactionQueueStyles.transactionDescription}>
          {getTxLabel(txItem)}
          {txItem.vaultAddress ? (
            <Text as="span" variant="p4" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              ·&nbsp;{formatAddress(txItem.vaultAddress)}
            </Text>
          ) : null}
        </Text>
        <div className={transactionQueueStyles.transactionActions}>
          <SimpleTransactionButton
            txItem={txItem}
            chainId={txItem.chainId}
            onTxSuccess={handleTxSuccess(txItem)}
            disabled={onWrongChain || isSettingChain}
          />
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
  )

  return (
    <Card className={transactionQueueStyles.cardWrapper}>
      <AnimateHeight
        id="transaction-queue-not-connected"
        show={!userConnected && !isLoading}
        keepChildrenRendered
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <WalletLabel />
        </div>
      </AnimateHeight>

      {!isLoading &&
        chainGroups.map((group) => {
          const onWrongChain = userConnected && chain.id !== group.chainId
          const groupChainName =
            sdkChainIdToHumanNetwork(group.chainId) || `Chain ID ${group.chainId}`

          return (
            <div key={group.chainId}>
              {isMultiChain ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                  }}
                >
                  <Text as="span" variant="p3semi">
                    {capitalize(groupChainName)}
                  </Text>
                  {onWrongChain ? (
                    <Button variant="primaryMedium" onClick={() => switchToChain(group.chainId)}>
                      Switch to {capitalize(groupChainName)}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <AnimateHeight
                  id={`transaction-queue-wrong-chain-${group.chainId}`}
                  show={(onWrongChain || isSettingChain) && !isLoading}
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
                    <Button variant="primaryMedium" onClick={() => switchToChain(group.chainId)}>
                      Switch to {capitalize(groupChainName)} network
                    </Button>
                  </div>
                </AnimateHeight>
              )}
              {group.items.map((txItem, index) =>
                renderRow(txItem, index === group.items.length - 1, onWrongChain),
              )}
            </div>
          )
        })}

      <AnimateHeight
        id="transaction-queue-no-items"
        show={(transactionQueue.length === 0 && userConnected) || isLoading}
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
      {transactionQueue.some(isExportable) ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <ExportToSafeButton transactions={transactionQueue} />
        </div>
      ) : null}
    </Card>
  )
}
