'use client'

import { useCallback, useMemo, useState } from 'react'
import { useChain } from '@account-kit/react'
import {
  AnimateHeight,
  Button,
  Card,
  Icon,
  SDKChainIdToAAChainMap,
  Text,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { sdkChainIdToHumanNetwork } from '@summerfi/app-utils'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { SimpleTransactionButton } from '@/components/organisms/SimpleTransactionButton/SimpleTransactionButton'
import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'

import transactionQueueStyles from './TransactionQueue.module.css'

export const TransactionQueue = ({
  transactionQueue,
  removeTransaction,
  chainId,
  onTxSuccess,
}: {
  transactionQueue: SDKTransactionItem[]
  removeTransaction: (id: string) => void
  chainId: SupportedNetworkIds
  onTxSuccess?: () => void
}) => {
  const { userWalletAddress } = useUserWallet()
  const { chain, isSettingChain, setChain } = useChain()
  const [transactionRemovedLocally, setTransactionRemovedLocally] = useState<SDKTransactionItem[]>(
    [],
  )

  const isProperChain = useMemo(() => {
    return chain.id === chainId
  }, [chain.id, chainId])

  const properChainName = useMemo(() => {
    return sdkChainIdToHumanNetwork(chainId) || `Chain ID ${chainId}`
  }, [chainId])

  const switchToProperChain = useCallback(() => {
    setChain({ chain: SDKChainIdToAAChainMap[chainId] })
  }, [chainId, setChain])

  const handleTransactionRemove = useCallback(
    (id: string) => {
      // Animation handling - fade out before removing from the list
      const txToRemove = transactionQueue.find((tx) => tx.id === id)

      if (txToRemove) {
        setTransactionRemovedLocally((prev) => [...prev, txToRemove])
        setTimeout(() => {
          removeTransaction(id)
          setTransactionRemovedLocally((prev) => prev.filter((tx) => tx.id !== id))
        }, 600) // Duration should match the AnimateHeight transition duration
      }
    },
    [removeTransaction, transactionQueue],
  )

  const userConnected = !!userWalletAddress
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
      <AnimateHeight
        id="transaction-queue-wrong-chain"
        show={(userConnected && !isProperChain) || isSettingChain}
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
          <Button variant="primaryMedium" onClick={switchToProperChain}>
            Switch to {capitalize(properChainName)} network
          </Button>
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
            <Text as="p" variant="p2" className={transactionQueueStyles.transactionDescription}>
              {getTxLabel(txItem)}
            </Text>
            <div className={transactionQueueStyles.transactionActions}>
              <SimpleTransactionButton
                txItem={txItem}
                chainId={chainId}
                onTxSuccess={onTxSuccess}
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
      ))}
      <AnimateHeight
        id="transaction-queue-no-items"
        show={transactionQueue.length === 0 && userConnected && isProperChain}
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
