'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAuthModal,
  useChain,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from '@account-kit/react'
import {
  type EarnAllowanceTypes,
  type EarnTransactionTypes,
  type EarnTransactionViewStates,
  type SDKVaultishType,
  type TransactionInfoLabeled,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId, ten, zero } from '@summerfi/app-utils'
import { Address, ChainInfo, type TransactionInfo } from '@summerfi/sdk-client-react'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { useRouter } from 'next/navigation'
import { erc20Abi } from 'viem'

import { accountType, SDKChainIdToAAChainMap } from '@/account-kit/config'
import { TransactionAction } from '@/constants/transaction-actions'
import { getApprovalTx } from '@/helpers/get-approval-tx'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { type useClient } from '@/hooks/use-client'
import { useClientChainId } from '@/hooks/use-client-chain-id'

type UseTransactionParams = {
  vault: SDKVaultishType
  amount: BigNumber | undefined
  manualSetAmount: (amount: string | undefined) => void
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  publicClient?: ReturnType<typeof useClient>['publicClient']
  flow: 'open' | 'manage'
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
  amount,
  publicClient,
  tokenBalance,
  tokenBalanceLoading,
  flow,
}: UseTransactionParams) => {
  const { refresh: refreshView } = useRouter()
  const user = useUser()
  const { getDepositTX, getWithdrawTX } = useAppSDK()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()
  const [transactionType, setTransactionType] = useState<TransactionAction>(
    TransactionAction.DEPOSIT,
  )
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [approval, setApproval] = useState<BigNumber>()
  const [approvalType, setApprovalType] = useState<EarnAllowanceTypes>('deposit')
  const [approvalCustomValue, setApprovalCustomValue] = useState<BigNumber>(zero)
  const [txHashes, setTxHashes] = useState<{ type: EarnTransactionTypes; hash: string }[]>([])
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<TransactionInfoLabeled[]>()
  const [sidebarError, setSidebarError] = useState<string>()

  const { client: smartAccountClient, error } = useSmartAccountClient({ type: accountType })

  // eslint-disable-next-line no-console
  console.log('smartAccountClient', { client: smartAccountClient, error })

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)
  const isProperChainSelected = clientChainId === vaultChainId
  const {
    symbol: inputTokenSymbol,
    id: inputTokenAddress,
    decimals: inputTokenDecimals,
  } = vault.inputToken

  const nextTransaction = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return undefined
    }

    return transactions[0]
  }, [transactions])

  // Configure User Operation (transaction) sender, passing client which can be undefined
  const {
    sendUserOperation,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      setWaitingForTx(hash)
      if (nextTransaction) {
        setTxHashes((prev) => [
          ...prev,
          {
            type: nextTransaction.label,
            hash,
          },
        ])
      }
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('Error executing the transaction:', err)

      if (err instanceof Error) {
        setSidebarError(err.message)
      } else {
        setSidebarError('Error executing the transaction')
      }
    },
  })

  const sendTransaction = useCallback(
    ({
      target,
      data,
      value = 0n,
    }: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint
    }) => {
      return sendUserOperation({
        uo: {
          target,
          data,
          value,
        },
      })
    },
    [sendUserOperation],
  )

  const executeNextTransaction = useCallback(() => {
    setTxStatus('txInProgress')

    if (!nextTransaction) {
      throw new Error('No transaction to execute')
    }
    if (!user) {
      throw new Error('User not logged in')
    }
    if (!publicClient) {
      throw new Error('Public client not available')
    }
    const txParams =
      nextTransaction.label === 'approve' && approvalType !== 'deposit'
        ? {
            target: nextTransaction.transaction.target.value,
            data: getApprovalTx(
              user.address,
              BigInt(approvalCustomValue.times(ten.pow(inputTokenDecimals)).toString()),
            ),
          }
        : {
            target: nextTransaction.transaction.target.value,
            data: nextTransaction.transaction.calldata,
          }

    sendTransaction(txParams)
  }, [
    approvalCustomValue,
    approvalType,
    inputTokenDecimals,
    nextTransaction,
    publicClient,
    sendTransaction,
    setTxStatus,
    user,
  ])

  const backToInit = useCallback(() => {
    // just goes to the first view, without any transactions loaded
    setTransactions(undefined)
    setTxStatus('idle')
    setApprovalType('deposit')
  }, [setApprovalType, setTransactions, setTxStatus])

  const reset = useCallback(() => {
    // resets everything
    backToInit()
    manualSetAmount(undefined)
    setSidebarError(undefined)
    setTxHashes([])
  }, [backToInit, manualSetAmount, setSidebarError, setTxHashes])

  const removeTxHash = useCallback(
    (txHash: string) => {
      setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
    },
    [setTxHashes],
  )

  const getTransactionsList = useCallback(async () => {
    if (amount && user) {
      setTxStatus('loadingTx')
      try {
        const transactionsList: TransactionInfo[] = await {
          [TransactionAction.DEPOSIT]: getDepositTX,
          [TransactionAction.WITHDRAW]: getWithdrawTX,
        }[transactionType]({
          walletAddress: Address.createFromEthereum({
            value: user.address,
          }),
          amount: amount.toString(),
          fleetAddress: vault.id,
          chainInfo: ChainInfo.createFrom({
            name: vault.protocol.network,
            chainId: vaultChainId,
          }),
        })

        if (transactionsList.length === 0) {
          throw new Error('Error getting the transactions list')
        }
        setTransactions(labelTransactions(transactionsList))
        setTxStatus('txPrepared')
      } catch (err) {
        if (err instanceof Error) {
          setSidebarError(err.message)
        } else {
          setSidebarError('Error getting the transaction')
        }
      }
    }
  }, [
    amount,
    user,
    setTxStatus,
    transactionType,
    setTransactions,
    getDepositTX,
    vault.id,
    vault.protocol.network,
    vaultChainId,
    getWithdrawTX,
    setSidebarError,
  ])

  const sidebarPrimaryButton = useMemo(() => {
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

    if (!tokenBalanceLoading && tokenBalance && tokenBalance.isZero() && flow === 'open') {
      return {
        label: 'Add funds',
        action: () => setIsTransakOpen(true),
        disabled: false,
      }
    }

    if (!amount || amount.isZero()) {
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
        label: {
          approve: `Approve ${inputTokenSymbol}`,
          deposit: 'Deposit',
          withdraw: 'Withdraw',
        }[nextTransaction.label],
        action: executeNextTransaction,
      }
    }

    // if there are no transactions, and the last one was successful
    // if this is what you're seeing it means it should automatically refresh the view
    // if it didnt, it's a bug
    if (txStatus === 'txSuccess') {
      return {
        label: 'Success',
        action: () => null,
        disabled: true,
      }
    }

    return {
      label: 'Preview',
      action: getTransactionsList,
    }
  }, [
    tokenBalanceLoading,
    tokenBalance,
    user,
    isProperChainSelected,
    isSettingChain,
    amount,
    txStatus,
    nextTransaction?.label,
    transactionType,
    getTransactionsList,
    openAuthModal,
    isAuthModalOpen,
    vaultChainId,
    setChain,
    inputTokenSymbol,
    executeNextTransaction,
  ])

  const sidebarTitle = useMemo(() => {
    if (nextTransaction?.label === 'deposit') {
      return 'Preview deposit'
    }

    return nextTransaction?.label
      ? capitalize(nextTransaction.label)
      : capitalize(TransactionAction.DEPOSIT)
  }, [nextTransaction?.label])

  // load approval amount
  useEffect(() => {
    if (publicClient && user) {
      publicClient
        .readContract({
          abi: erc20Abi,
          address: inputTokenAddress as `0x${string}`,
          functionName: 'allowance',
          args: [user.address, vault.id as `0x${string}`],
        })
        .then((approvalAmount) => {
          const approvalParsed = new BigNumber(approvalAmount.toString()).div(
            ten.pow(inputTokenDecimals),
          )

          setApproval(approvalParsed)
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error reading token allowance', err)
        })
    }
  }, [
    inputTokenAddress,
    inputTokenDecimals,
    publicClient,
    user,
    vault.id,
    setApproval,
    /** last one is pretty important because we want to update
     * the allowance when the transactions change (are executed or not) */
    transactions?.length,
  ])

  // skip approval if the user has enough allowance
  useEffect(() => {
    if (nextTransaction?.label === 'approve' && approval && approval.gte(amount ?? zero)) {
      setTransactions((prevTransactions) => prevTransactions?.slice(1))
    }
  }, [amount, approval, nextTransaction?.label])

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (
      txStatus === 'txSuccess' &&
      !isSendingUserOperation &&
      transactions?.length === 0 &&
      !waitingForTx
    ) {
      refreshView()
      reset()
    }
  }, [refreshView, reset, waitingForTx, transactions?.length, txStatus, isSendingUserOperation])

  // watch for sendUserOperationError
  useEffect(() => {
    if (sendUserOperationError && txStatus === 'txInProgress') {
      setTxStatus('txError')
    }
  }, [sendUserOperationError, setTxStatus, txStatus])

  // custom wait for tx to be processed
  useEffect(() => {
    if (waitingForTx && txStatus !== 'txSuccess' && publicClient) {
      waitForTransaction({ publicClient, hash: waitingForTx })
        .then(() => {
          setTxStatus('txSuccess')
          setWaitingForTx(undefined)
          setTransactions(transactions?.slice(1))
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction', err)
          setTxStatus('txError')
        })
    }
  }, [
    waitingForTx,
    txStatus,
    publicClient,
    transactions,
    setTxStatus,
    setWaitingForTx,
    setTransactions,
  ])

  return {
    manualSetAmount,
    sidebar: {
      title: sidebarTitle,
      primaryButton: sidebarPrimaryButton,
      error: sidebarError,
    },
    nextTransaction,
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    backToInit,
    user,
    setTransactionType,
    transactionType,
    approvalType,
    setApprovalType,
    setApprovalCustomValue,
    approvalCustomValue,
    isTransakOpen,
    setIsTransakOpen,
  }
}
