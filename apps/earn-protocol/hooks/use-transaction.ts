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
import { encodeFunctionData, erc20Abi } from 'viem'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { TransactionAction } from '@/constants/transaction-actions'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { type useClient } from '@/hooks/use-client'
import { useClientChainId } from '@/hooks/use-client-chain-id'

type UseTransactionParams = {
  vault: SDKVaultishType
  amount: BigNumber | undefined
  manualSetAmount: (amount: string | undefined) => void
  publicClient?: ReturnType<typeof useClient>['publicClient']
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
}: UseTransactionParams) => {
  const [transactionType, setTransactionType] = useState<TransactionAction>(
    TransactionAction.DEPOSIT,
  )
  const { refresh: refreshView } = useRouter()
  const user = useUser()
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [approval, setApproval] = useState<BigNumber>()
  const [approvalType, setApprovalType] = useState<EarnAllowanceTypes>('deposit')
  const [approvalCustomValue, setApprovalCustomValue] = useState<BigNumber>(zero)
  const [txHashes, setTxHashes] = useState<{ type: EarnTransactionTypes; hash: string }[]>([])
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<TransactionInfoLabeled[]>()
  const [error, setError] = useState<string>()
  const { getDepositTX, getWithdrawTX } = useAppSDK()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()

  const { client: smartAccountClient } = useSmartAccountClient({ type: 'LightAccount' })

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
        setError(err.message)
      } else {
        setError('Error executing the transaction')
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
      sendUserOperation({
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
    if (nextTransaction.label === 'approve') {
      // approval amount defaults to the amount user wants to deposit
      if (approvalType === 'deposit') {
        sendTransaction({
          target: nextTransaction.transaction.target.value,
          data: nextTransaction.transaction.calldata,
        })

        return
      }
      // if not, we need to approve a custom amount
      const calldata = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          user.address,
          BigInt(approvalCustomValue.times(ten.pow(inputTokenDecimals)).toString()),
        ],
      })

      sendTransaction({
        target: nextTransaction.transaction.target.value,
        data: calldata,
      })
    } else {
      // this will be deposit/withdraw 99.99% of the time
      sendTransaction({
        target: nextTransaction.transaction.target.value,
        data: nextTransaction.transaction.calldata,
      })
    }
  }, [
    approvalCustomValue,
    approvalType,
    inputTokenDecimals,
    nextTransaction,
    publicClient,
    sendTransaction,
    user,
  ])

  const backToInit = useCallback(() => {
    // just goes to the first view, without any transactions loaded
    setTransactions(undefined)
    setTxStatus('idle')
    setApprovalType('deposit')
  }, [])

  const reset = useCallback(() => {
    // resets everything
    backToInit()
    manualSetAmount(undefined)
    setError(undefined)
    setTxHashes([])
  }, [manualSetAmount, backToInit])

  const removeTxHash = useCallback((txHash: string) => {
    setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
  }, [])

  const getTransactionsList = useCallback(async () => {
    if (amount && user) {
      setTxStatus('loadingTx')
      try {
        let transactionsList: TransactionInfo[] = []

        switch (transactionType) {
          case TransactionAction.DEPOSIT:
            transactionsList = await getDepositTX({
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

            break
          case TransactionAction.WITHDRAW:
            transactionsList = await getWithdrawTX({
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

            break

          default:
            throw new Error('Invalid transaction type')
        }

        if (transactionsList.length === 0) {
          throw new Error('Error getting the transactions list')
        }
        setTransactions(labelTransactions(transactionsList))
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
    amount,
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

  const title = useMemo(() => {
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
  }, [sendUserOperationError, txStatus])

  // custom wait for tx to be processed
  useEffect(() => {
    if (waitingForTx && txStatus !== 'txSuccess' && publicClient) {
      publicClient
        .waitForTransactionReceipt({
          hash: waitingForTx,
          confirmations: 2,
        })
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
  }, [waitingForTx, txStatus, publicClient, transactions])

  return {
    manualSetAmount,
    sidebar: {
      title,
      primaryButton,
      error,
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
  }
}
