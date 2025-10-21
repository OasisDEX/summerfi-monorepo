'use client'
import { useCallback, useMemo } from 'react'
import { Button, LoadingSpinner, Tooltip } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'

import { type SDKTransactionItem } from '@/hooks/useSDKTransactionQueue'
import { useSimpleTransaction } from '@/hooks/useSimpleTransaction'

import transactionQueueStyles from './TransactionQueue.module.css'

export const SimpleTransactionButton = ({
  txItem,
  chainId,
}: {
  txItem: SDKTransactionItem
  chainId: SupportedNetworkIds
}) => {
  const { executeTransaction, isSendingUserOperation, txStatus, txError } = useSimpleTransaction({
    chainId,
  })
  /**
    'idle'
    'txError'
    'txInProgress'
    'txSuccess'
   */

  const isLoading = useMemo(() => {
    const isLoadingTransaction = !txItem.txError && !txItem.txData?.transaction

    return isLoadingTransaction || isSendingUserOperation
  }, [isSendingUserOperation, txItem.txData?.transaction, txItem.txError])

  const buttonDisabled = useMemo(() => {
    return !!txItem.txError || !txItem.txData?.transaction || isLoading
  }, [isLoading, txItem.txData?.transaction, txItem.txError])

  const buttonLabel = useMemo(() => {
    if (txStatus === 'txInProgress') {
      return 'In progress...'
    }
    if (txStatus === 'txError') {
      return (
        <Tooltip tooltip={<div>{txError}</div>}>
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
  }, [isLoading, txItem.txData?.transaction, txItem.txError, txStatus, txError])

  const buttonAction = useCallback(() => {
    if (txItem.txData?.transaction && !txItem.txError && !isLoading) {
      return executeTransaction(txItem)
    }

    return undefined
  }, [executeTransaction, isLoading, txItem])

  return (
    <Button
      variant={txItem.txData?.transaction ? 'primarySmall' : 'neutralSmall'}
      className={transactionQueueStyles.transactionActionsSubmitButton}
      disabled={buttonDisabled}
      onClick={buttonAction}
    >
      {buttonLabel}
    </Button>
  )
}
