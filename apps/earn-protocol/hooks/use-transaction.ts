'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthModal, useChain, useUser } from '@account-kit/react'
import {
  type EarnTransactionTypes,
  type EarnTransactionViewStates,
  type SDKVaultishType,
  type TransactionInfoLabeled,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { Address, ChainInfo, type TransactionInfo } from '@summerfi/sdk-client-react'
import type BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { useRouter } from 'next/navigation'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { TransactionAction } from '@/constants/transaction-actions'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { type useClient } from '@/hooks/use-client'
import { useClientChainId } from '@/hooks/use-client-chain-id'

type UseTransactionParams = {
  vault: SDKVaultishType
  amountParsed: BigNumber | undefined
  manualSetAmount: (amountParsed: string | undefined) => void
  transactionClient: ReturnType<typeof useClient>['transactionClient']
  publicClient: ReturnType<typeof useClient>['publicClient']
}

const labelTransactions = (transactions: TransactionInfo[]) => {
  return transactions.map((tx) => ({
    ...tx,
    // kinda hacky, but works for now
    label: tx.description.split(' ')[0].toLowerCase() as TransactionInfoLabeled['label'],
  }))
}

export const useTransaction = ({
  vault,
  manualSetAmount,
  transactionClient,
  publicClient,
  amountParsed,
}: UseTransactionParams) => {
  const [transactionType, setTransactionType] = useState<TransactionAction>(
    TransactionAction.DEPOSIT,
  )
  const { refresh: refreshView } = useRouter()
  const [txHashes, setTxHashes] = useState<{ type: EarnTransactionTypes; hash: string }[]>([])
  const [txSteps, setTxSteps] = useState<number>()
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<TransactionInfoLabeled[]>()
  const [error, setError] = useState<string>()
  const { getDepositTX, getWithdrawTX } = useAppSDK()
  const user = useUser()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()

  const reset = useCallback(() => {
    manualSetAmount(undefined)
    setTransactions(undefined)
    setTxStatus('idle')
    setError(undefined)
    setTxHashes([])
  }, [manualSetAmount])

  const removeTxHash = useCallback((txHash: string) => {
    setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
  }, [])

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const isProperChainSelected = clientChainId === vaultChainId

  const nextTransaction = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return undefined
    }

    return transactions[0]
  }, [transactions])

  const executeNextTransaction = useCallback(async () => {
    setTxStatus('txInProgress')

    if (!transactionClient || !publicClient) {
      throw new Error('Error executing the transaction, no public or transaction client')
    }

    if (!nextTransaction) {
      throw new Error('No transaction to execute')
    }
    try {
      const transactionHash = await transactionClient.sendTransaction({
        to: nextTransaction.transaction.target.value,
        data: nextTransaction.transaction.calldata,
      })

      await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: 5,
      })

      setTxHashes((prev) => [
        ...prev,
        {
          type: nextTransaction.label,
          hash: transactionHash,
        },
      ])
      setTxStatus('txSuccess')
      setTransactions(transactions?.slice(1))
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error executing the transaction')
      }
    }
  }, [nextTransaction, transactionClient, publicClient, transactions])

  const getTransactionsList = useCallback(async () => {
    if (amountParsed && user) {
      setTxStatus('loadingTx')
      try {
        let transactionsList: TransactionInfo[] = []

        switch (transactionType) {
          case TransactionAction.DEPOSIT:
            transactionsList = await getDepositTX({
              walletAddress: Address.createFromEthereum({
                value: user.address,
              }),
              amount: amountParsed.toString(),
              fleetAddress: vault.id,
              chainInfo: ChainInfo.createFrom({
                name: vault.protocol.network,
                chainId: vaultChainId,
              }),
            })

            break
          case TransactionAction.WITHDRAW:
            transactionsList = await getWithdrawTX({
              walletAddress: Address.createFromEthereum({
                value: user.address,
              }),
              amount: amountParsed.toString(),
              fleetAddress: vault.id,
              chainInfo: ChainInfo.createFrom({
                name: vault.protocol.network,
                chainId: vaultChainId,
              }),
            })

            break

          default:
            throw new Error('Invalid transaction type')
        }

        if (transactionsList.length === 0) {
          throw new Error('Error getting the transactions list')
        }
        setTransactions(labelTransactions(transactionsList))
        setTxSteps(transactionsList.length)
        setTxStatus('txPrepared')
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error getting the transaction')
        }
      }
    }
  }, [
    amountParsed,
    user,
    transactionType,
    getDepositTX,
    vault.id,
    vault.protocol.network,
    vaultChainId,
    getWithdrawTX,
  ])

  const primaryButton = useMemo(() => {
    // missing data
    if (!user) {
      return {
        label: 'Log in',
        action: openAuthModal,
        disabled: isAuthModalOpen,
        loading: isAuthModalOpen,
      }
    }
    if (!isProperChainSelected || isSettingChain) {
      return {
        label: `Change network to ${vaultChainId}`,
        action: () => {
          setChain({
            chain: SDKChainIdToAAChainMap[vaultChainId],
          })
        },
        disabled: isSettingChain,
        loading: isSettingChain,
      }
    }
    if (!amountParsed || amountParsed.isZero()) {
      return {
        label: capitalize(transactionType),
        action: () => null,
        disabled: true,
      }
    }

    // based on the txStatus
    if (['loadingTx', 'txInProgress'].includes(txStatus)) {
      return {
        label: 'Loading...',
        action: () => null,
        disabled: true,
        loading: true,
      }
    }

    // transactions loaded from the SDK
    // execute them one by one
    if (nextTransaction?.label) {
      return {
        label: `${capitalize(nextTransaction.label)} (${transactions?.length}/${txSteps})`,
        action: executeNextTransaction,
      }
    }

    // if there are no transactions, and the last one was successful
    if (txStatus === 'txSuccess') {
      return {
        label: 'Success :)',
        action: () => null,
        disabled: true,
      }
    }

    return {
      label: `Prepare ${transactionType}`,
      action: getTransactionsList,
    }
  }, [
    user,
    isProperChainSelected,
    isSettingChain,
    amountParsed,
    transactionType,
    txStatus,
    nextTransaction?.label,
    getTransactionsList,
    openAuthModal,
    isAuthModalOpen,
    vaultChainId,
    setChain,
    transactions?.length,
    txSteps,
    executeNextTransaction,
  ])

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (txStatus === 'txSuccess' && transactions?.length === 0) {
      refreshView()
      reset()
    }
  }, [refreshView, reset, transactions?.length, txStatus])

  return {
    manualSetAmount,
    amountParsed,
    sidebar: {
      primaryButton,
      error,
    },
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    user,
    setTransactionType,
    transactionType,
  }
}
