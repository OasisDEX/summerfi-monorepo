'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAuthModal,
  useChain,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from '@account-kit/react'
import { getVaultPositionUrl, getVaultUrl, useIsIframe } from '@summerfi/app-earn-ui'
import {
  type EarnAllowanceTypes,
  type EarnTransactionViewStates,
  type SDKVaultishType,
  TransactionAction,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, ten } from '@summerfi/app-utils'
import {
  Address,
  type ExtendedTransactionInfo,
  getChainInfoByChainId,
  type IToken,
  TokenAmount,
  TransactionType,
} from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { useRouter } from 'next/navigation'
import { type PublicClient } from 'viem'

import {
  type AccountKitSupportedNetworks,
  accountType,
  SDKChainIdToAAChainMap,
} from '@/account-kit/config'
import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { getApprovalTx } from '@/helpers/get-approval-tx'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useClientChainId } from '@/hooks/use-client-chain-id'

import { useUserWallet } from './use-user-wallet'

type UseTransactionParams = {
  vault: SDKVaultishType
  vaultChainId: AccountKitSupportedNetworks
  amount: BigNumber | undefined
  manualSetAmount: (amount: string | undefined) => void
  vaultToken: IToken | undefined
  token: IToken | undefined
  tokenBalance: BigNumber | undefined
  tokenBalanceLoading: boolean
  publicClient?: PublicClient
  flow: 'open' | 'manage'
  ownerView?: boolean
  positionAmount?: BigNumber
  approvalCustomValue?: BigNumber
  approvalTokenSymbol?: string
}

const errorsMap = {
  // our custom errors
  insufficientBalanceError: 'Insufficient balance',
  insufficientPositionBalanceError: 'Insufficient position balance',
  transactionExecutionError: 'Error executing the transaction',
  transactionRetrievalError: 'Error getting the transaction',
  // mapped package rejections
  TransactionExecutionError: 'Error executing the transaction',
}

export const useTransaction = ({
  vault,
  vaultChainId,
  manualSetAmount,
  amount,
  publicClient,
  vaultToken,
  token,
  tokenBalance,
  tokenBalanceLoading,
  flow,
  ownerView, // on non-owner views we dont want to make all of these calls
  positionAmount,
  approvalCustomValue,
}: UseTransactionParams) => {
  const { refresh: refreshView, push } = useRouter()
  const [slippageConfig] = useSlippageConfig()
  const user = useUser()
  const { userWalletAddress } = useUserWallet()
  const { getDepositTx: getDepositTX, getWithdrawTx: getWithdrawTX } = useAppSDK()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()
  const [transactionType, setTransactionType] = useState<TransactionAction>(
    TransactionAction.DEPOSIT,
  )
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [approvalType, setApprovalType] = useState<EarnAllowanceTypes>('deposit')
  const [txHashes, setTxHashes] = useState<
    { type: TransactionType; hash?: string; custom?: string }[]
  >([])
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<ExtendedTransactionInfo[]>()
  const [sidebarTransactionError, setSidebarTransactionError] = useState<string>()
  const [sidebarValidationError, setSidebarValidationError] = useState<string>()
  const [selectedSwitchVault, setSelectedSwitchVault] = useState<
    `${string}-${number}` | undefined
  >()
  const isIframe = useIsIframe()

  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const isProperChainSelected = clientChainId === vaultChainId
  const isWithdraw = transactionType === TransactionAction.WITHDRAW
  const isDeposit = transactionType === TransactionAction.DEPOSIT
  const isSwitch = transactionType === TransactionAction.SWITCH

  const nextTransaction = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return undefined
    }

    return transactions[0]
  }, [transactions])

  const approvalTokenSymbol = useMemo(() => {
    return nextTransaction?.type === TransactionType.Approve
      ? nextTransaction.metadata.approvalAmount.token.symbol
      : ''
  }, [nextTransaction?.metadata, nextTransaction?.type])

  // Configure User Operation (transaction) sender, passing client which can be undefined
  const {
    sendUserOperation,
    error: sendUserOperationError,
    isSendingUserOperation,
  } = useSendUserOperation({
    client: smartAccountClient,
    waitForTxn: true,
    onSuccess: ({ hash }) => {
      if (isIframe) {
        getSafeTxHash(hash, vault.protocol.network)
          .then((safeTransactionData) => {
            if (safeTransactionData.transactionHash) {
              setWaitingForTx(safeTransactionData.transactionHash)
            }
            if (nextTransaction) {
              setTxHashes((prev) => {
                const nextHashes = [
                  ...prev,
                  {
                    type: nextTransaction.type,
                    hash: safeTransactionData.transactionHash,
                  },
                ]

                if (
                  safeTransactionData.confirmations.length >
                  safeTransactionData.confirmationsRequired
                ) {
                  nextHashes.push({
                    type: nextTransaction.type,
                    custom:
                      'Multisig transaction detected. After all confirmations are done, the position will be ready.',
                  })
                }

                return nextHashes
              })
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error getting the safe tx hash:', err)
          })
      } else {
        setWaitingForTx(hash)
        if (nextTransaction) {
          setTxHashes((prev) => [
            ...prev,
            {
              type: nextTransaction.type,
              hash,
            },
          ])
        }
      }
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('Error executing the transaction:', err)

      if (err instanceof Error && 'shortMessage' in err && typeof err.shortMessage === 'string') {
        setSidebarTransactionError(err.shortMessage)
      } else if (err instanceof Error && err.name in errorsMap) {
        setSidebarTransactionError(errorsMap[err.name as keyof typeof errorsMap])
      } else {
        setSidebarTransactionError(errorsMap.TransactionExecutionError)
      }
    },
  })

  const sendTransaction = useCallback(
    (
      {
        target,
        data,
        value = 0n,
      }: {
        target: `0x${string}`
        data: `0x${string}`
        value?: bigint
      },
      overrides?: { paymasterAndData: `0x${string}` },
    ) => {
      return sendUserOperation({
        uo: {
          target,
          data,
          value,
        },
        overrides,
      })
    },
    [sendUserOperation],
  )

  const executeNextTransaction = useCallback(async () => {
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
    if (!token) {
      throw new Error('Token not loaded')
    }

    const txParams =
      nextTransaction.type === TransactionType.Approve &&
      approvalType !== 'deposit' &&
      approvalCustomValue
        ? {
            target: nextTransaction.transaction.target.value,
            data: getApprovalTx(
              nextTransaction.metadata.approvalSpender.value,
              BigInt(
                approvalCustomValue
                  .times(ten.pow(nextTransaction.metadata.approvalAmount.token.decimals))
                  .toString(),
              ),
            ),
            value: BigInt(nextTransaction.transaction.value),
          }
        : {
            target: nextTransaction.transaction.target.value,
            data: nextTransaction.transaction.calldata,
            value: BigInt(nextTransaction.transaction.value),
          }

    const resolvedOverrides = await getGasSponsorshipOverride({
      smartAccountClient,
      txParams,
    })

    sendTransaction(txParams, resolvedOverrides)
  }, [
    token,
    approvalCustomValue,
    approvalType,
    nextTransaction,
    publicClient,
    sendTransaction,
    setTxStatus,
    user,
    smartAccountClient,
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
    setSidebarTransactionError(undefined)
    setSidebarValidationError(undefined)
    setTxHashes([])
  }, [backToInit, manualSetAmount, setSidebarTransactionError, setTxHashes])

  const removeTxHash = useCallback(
    (txHash: string) => {
      setTxHashes((prev) => prev.filter((tx) => tx.hash !== txHash))
    },
    [setTxHashes],
  )

  const getTransactionsList = useCallback(async () => {
    // get deposit/withdraw transactions
    if ((isWithdraw || isDeposit) && ownerView && token && vaultToken && amount && user) {
      const fromToken = {
        [TransactionAction.DEPOSIT]: token,
        [TransactionAction.WITHDRAW]: vaultToken,
      }[transactionType]
      const toToken = {
        [TransactionAction.DEPOSIT]: vaultToken,
        [TransactionAction.WITHDRAW]: token,
      }[transactionType]

      setTxStatus('loadingTx')
      try {
        const transactionsList = await {
          [TransactionAction.DEPOSIT]: getDepositTX,
          [TransactionAction.WITHDRAW]: getWithdrawTX,
        }[transactionType]({
          walletAddress: Address.createFromEthereum({
            value: user.address,
          }),
          amount: TokenAmount.createFrom({
            token: fromToken,
            amount: amount.toString(),
          }),
          toToken,
          fleetAddress: vault.id,
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: Number(slippageConfig.slippage),
        })

        if (transactionsList.length === 0) {
          throw new Error('Error getting the transactions list')
        }
        setTransactions(transactionsList)
        setTxStatus('txPrepared')
      } catch (err) {
        if (err instanceof Error) {
          setSidebarTransactionError(err.message)
        } else {
          setSidebarTransactionError(errorsMap.transactionRetrievalError)
        }
      }
    }
    // get switch transactions
    if (isSwitch && ownerView && selectedSwitchVault) {
      setTxStatus('loadingTx')
      // eslint-disable-next-line no-console
      console.log('switching vault', selectedSwitchVault)
      setTimeout(() => {
        setTxStatus('txSuccess')
      }, 1000)
    }
  }, [
    isWithdraw,
    isDeposit,
    isSwitch,
    ownerView,
    token,
    vaultToken,
    amount,
    user,
    transactionType,
    selectedSwitchVault,
    getDepositTX,
    getWithdrawTX,
    vault.id,
    vaultChainId,
    slippageConfig.slippage,
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
    if (!ownerView) {
      // only if logged in (check above)
      return {
        label: 'Preview',
        action: () => null,
        disabled: true,
      }
    }
    if (!isProperChainSelected || isSettingChain) {
      const nextChain = SDKChainIdToAAChainMap[vaultChainId]

      return {
        label: `Change network to ${nextChain.name}`,
        action: () => {
          setChain({
            chain: nextChain,
          })
        },
        disabled: isSettingChain,
        loading: isSettingChain,
      }
    }

    if (!tokenBalanceLoading && tokenBalance && tokenBalance.isZero() && flow === 'open') {
      return {
        label: 'Buy crypto',
        action: () => setIsTransakOpen(true),
        disabled: false,
      }
    }

    // deposit balance check
    if (isDeposit && tokenBalance && amount && amount.isGreaterThan(tokenBalance)) {
      return {
        label: capitalize(transactionType),
        action: () => null,
        disabled: true,
        loading: false,
      }
    }

    // withdraw balance check
    if (isWithdraw && positionAmount && amount && amount.isGreaterThan(positionAmount)) {
      return {
        label: capitalize(transactionType),
        action: () => null,
        disabled: true,
        loading: false,
      }
    }

    // switch check
    if (isSwitch && selectedSwitchVault) {
      return {
        label: capitalize(transactionType),
        action: getTransactionsList,
      }
    }

    if (!amount || amount.isZero()) {
      return {
        label: capitalize(transactionType),
        action: () => null,
        disabled: true,
      }
    }

    // if there are transactions pending
    if (['loadingTx', 'txInProgress'].includes(txStatus)) {
      return {
        label: 'Loading...',
        action: () => null,
        disabled: true,
        loading: true,
      }
    }

    // if token is loading
    if (!token) {
      return {
        label: 'Loading...',
        action: () => null,
        disabled: true,
        loading: true,
      }
    }

    // transactions loaded from the SDK
    // execute them one by one
    if (nextTransaction?.type) {
      return {
        label: {
          [TransactionType.Approve]: `Approve ${approvalTokenSymbol}`,
          [TransactionType.Deposit]: 'Deposit',
          [TransactionType.Withdraw]: 'Withdraw',
        }[nextTransaction.type],
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
    ownerView,
    isProperChainSelected,
    isSettingChain,
    tokenBalanceLoading,
    tokenBalance,
    flow,
    isDeposit,
    isWithdraw,
    isSwitch,
    selectedSwitchVault,
    amount,
    positionAmount,
    txStatus,
    token,
    nextTransaction?.type,
    getTransactionsList,
    openAuthModal,
    isAuthModalOpen,
    vaultChainId,
    setChain,
    transactionType,
    approvalTokenSymbol,
    executeNextTransaction,
  ])

  const sidebarTitle = useMemo(() => {
    if (nextTransaction?.type === TransactionType.Deposit) {
      return 'Preview\u00A0deposit'
    }

    if (nextTransaction?.type === TransactionType.Withdraw) {
      return 'Preview\u00A0withdraw'
    }

    return nextTransaction?.type
      ? capitalize(nextTransaction.type)
      : capitalize(TransactionAction.DEPOSIT)
  }, [nextTransaction?.type])

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (
      txStatus === 'txSuccess' &&
      !isSendingUserOperation &&
      transactions?.length === 0 &&
      !waitingForTx
    ) {
      reset()
      if (userWalletAddress) {
        // refreshes the view
        refreshView()
        // revalidates users wallet data (all of fetches with wallet tagged in it)
        revalidatePositionData(
          sdkNetworkToHumanNetwork(vault.protocol.network),
          vault.id,
          userWalletAddress,
        )

        // makes sure the user is redirected to the correct page
        // after closing or opening
        const isOpening = isDeposit && flow === 'open'
        const isClosing =
          isWithdraw && positionAmount && flow === 'manage' && amount?.eq(positionAmount)

        if (isOpening || isClosing) {
          push(
            isOpening
              ? getVaultPositionUrl({
                  network: vault.protocol.network,
                  vaultId: vault.customFields?.slug ?? vault.id,
                  walletAddress: userWalletAddress,
                })
              : getVaultUrl(vault),
          )
        }
      }
    }
  }, [
    refreshView,
    amount,
    flow,
    isSendingUserOperation,
    positionAmount,
    push,
    reset,
    transactionType,
    transactions?.length,
    txStatus,
    vault,
    waitingForTx,
    userWalletAddress,
    isDeposit,
    isWithdraw,
  ])

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

  useEffect(() => {
    setSidebarTransactionError(undefined)
    if (isDeposit) {
      if (amount && tokenBalance && amount.isGreaterThan(tokenBalance) && !sidebarValidationError) {
        setSidebarValidationError(errorsMap.insufficientBalanceError)
      }
      if (amount && tokenBalance && !amount.isGreaterThan(tokenBalance) && sidebarValidationError) {
        setSidebarValidationError(undefined)
      }
    }
    if (isWithdraw) {
      if (
        amount &&
        positionAmount &&
        amount.isGreaterThan(positionAmount) &&
        !sidebarValidationError
      ) {
        setSidebarValidationError(errorsMap.insufficientPositionBalanceError)
      }
      if (
        amount &&
        positionAmount &&
        !amount.isGreaterThan(positionAmount) &&
        sidebarValidationError
      ) {
        setSidebarValidationError(undefined)
      }
    }
  }, [
    amount,
    sidebarValidationError,
    tokenBalance,
    transactionType,
    positionAmount,
    isDeposit,
    isWithdraw,
  ])

  return {
    manualSetAmount,
    sidebar: {
      title: sidebarTitle,
      primaryButton: sidebarPrimaryButton,
      error: sidebarTransactionError ?? sidebarValidationError,
    },
    nextTransaction,
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    backToInit,
    user,
    approvalTokenSymbol,
    setTransactionType,
    transactionType,
    approvalType,
    setApprovalType,
    isTransakOpen,
    setIsTransakOpen,
    setSelectedSwitchVault,
    selectedSwitchVault,
  }
}
