'use client'
import { useCallback, useMemo } from 'react'
import { useChain } from '@account-kit/react'
import {
  Button,
  LoadingSpinner,
  SDKChainIdToAAChainMap,
  Text,
  Tooltip,
} from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { sdkChainIdToHumanNetwork } from '@summerfi/app-utils'

import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'
import { useSimpleTransaction } from '@/hooks/useSimpleTransaction'

import transactionButtonStyles from './SimpleTransactionButton.module.css'

export const SimpleTransactionButton = ({
  txItem,
  chainId,
}: {
  txItem: SDKTransactionItem
  chainId: SupportedNetworkIds
}) => {
  const { chain, isSettingChain, setChain } = useChain()
  const { executeTransaction, isSendingUserOperation, txStatus, txError } = useSimpleTransaction({
    chainId,
  })
  const isLoading = useMemo(() => {
    const isLoadingTransaction = !txItem.txError && !txItem.txData?.transaction

    return isLoadingTransaction || isSendingUserOperation || isSettingChain
  }, [isSendingUserOperation, txItem.txData?.transaction, txItem.txError, isSettingChain])

  const isProperChain = useMemo(() => {
    return chain.id === chainId
  }, [chain.id, chainId])

  const buttonDisabled = useMemo(() => {
    return (
      !!txItem.txError ||
      !txItem.txData?.transaction ||
      isLoading ||
      ['txInProgress', 'txSuccess'].includes(txStatus)
    )
  }, [isLoading, txItem.txData?.transaction, txItem.txError, txStatus])

  const buttonLabel = useMemo(() => {
    if (!isProperChain) {
      return `Switch to ${sdkChainIdToHumanNetwork(chainId)}`
    }
    if (txStatus === 'txSuccess') {
      return 'Done!'
    }
    if (txStatus === 'txInProgress') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LoadingSpinner size={16} />
          <Text variant="p4semi">In progress...</Text>
        </div>
      )
    }
    if (txStatus === 'txError') {
      return (
        <Tooltip
          tooltip={
            <div className={transactionButtonStyles.tooltipContent}>
              <Text variant="p3semi">Click to try again.</Text>
              <Text variant="p4">{txError}</Text>
            </div>
          }
          showAbove
          tooltipWrapperStyles={{
            top: '-150px',
          }}
        >
          <span>Transaction Error</span>
        </Tooltip>
      )
    }
    if (txItem.txError) {
      return 'Loading transaction Error'
    }
    if (!txItem.txData?.transaction || isLoading) {
      return <LoadingSpinner size={24} />
    }

    return 'Execute'
  }, [
    isProperChain,
    txStatus,
    txItem.txError,
    txItem.txData?.transaction,
    isLoading,
    chainId,
    txError,
  ])

  const buttonAction = useCallback(() => {
    if (!isProperChain) {
      setChain({
        chain: SDKChainIdToAAChainMap[chainId],
      })

      return
    }
    if (
      txItem.txData?.transaction &&
      !txItem.txError &&
      !isLoading &&
      !['txInProgress', 'txSuccess'].includes(txStatus)
    ) {
      executeTransaction(txItem)
    }

    // eslint-disable-next-line no-console
    console.log('Action not mapped')
  }, [chainId, executeTransaction, isLoading, isProperChain, setChain, txItem, txStatus])

  const buttonVariant = useMemo(() => {
    if (txStatus === 'txError') {
      return 'neutralSmall'
    }

    return txItem.txData?.transaction ? 'primarySmall' : 'neutralSmall'
  }, [txItem.txData?.transaction, txStatus])

  return (
    <Button
      variant={txStatus === 'txSuccess' ? 'textPrimarySmall' : buttonVariant}
      className={transactionButtonStyles.transactionActionsSubmitButton}
      disabled={buttonDisabled}
      onClick={buttonAction}
    >
      {buttonLabel}
    </Button>
  )
}
