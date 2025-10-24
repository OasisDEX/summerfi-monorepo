'use client'
import { useCallback, useMemo } from 'react'
import { Button, LoadingSpinner, Text, Tooltip } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'

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
  const { executeTransaction, isSendingUserOperation, txStatus, txError } = useSimpleTransaction({
    chainId,
  })
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
  }, [isLoading, txItem.txData?.transaction, txItem.txError, txStatus, txError])

  const buttonAction = useCallback(() => {
    if (txItem.txData?.transaction && !txItem.txError && !isLoading) {
      return executeTransaction(txItem)
    }

    return undefined
  }, [executeTransaction, isLoading, txItem])

  const buttonVariant = useMemo(() => {
    if (txStatus === 'txError') {
      return 'neutralSmall'
    }

    return txItem.txData?.transaction ? 'primarySmall' : 'neutralSmall'
  }, [txItem.txData?.transaction, txStatus])

  return (
    <Button
      variant={buttonVariant}
      className={transactionButtonStyles.transactionActionsSubmitButton}
      disabled={buttonDisabled}
      onClick={buttonAction}
    >
      {buttonLabel}
    </Button>
  )
}
