/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useAuthModal,
  useChain,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from '@account-kit/react'
import Safe from '@safe-global/safe-apps-sdk'
import {
  accountType,
  getVaultPositionUrl,
  getVaultUrl,
  SDKChainIdToAAChainMap,
  useClientChainId,
  useIsIframe,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import {
  type EarnAllowanceTypes,
  type EarnTransactionViewStates,
  type SDKVaultishType,
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, supportedSDKNetwork, ten } from '@summerfi/app-utils'
import {
  Address,
  getChainInfoByChainId,
  type IToken,
  TokenAmount,
  TransactionType,
} from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import capitalize from 'lodash-es/capitalize'
import { useRouter } from 'next/navigation'
import { type PublicClient } from 'viem'

import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { getApprovalTx } from '@/helpers/get-approval-tx'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { getSafeTxHash } from '@/helpers/get-safe-tx-hash'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { waitForTransaction } from '@/helpers/wait-for-transaction'
import { useAppSDK } from '@/hooks/use-app-sdk'

type UseTransactionParams = {
  vault: SDKVaultishType
  vaultChainId: SupportedNetworkIds
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
  sidebarTransactionType: TransactionAction
  setSidebarTransactionType?: Dispatch<SetStateAction<TransactionAction>>
  referralCode?: string
  referralCodeError?: string | null
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
  sidebarTransactionType,
  setSidebarTransactionType,
  referralCode,
  referralCodeError,
}: UseTransactionParams) => {
  const { refresh: refreshView, push } = useRouter()
  const [slippageConfig] = useSlippageConfig()
  const user = useUser()
  const { userWalletAddress } = useUserWallet()
  const { getDepositTx: getDepositTX, getWithdrawTx: getWithdrawTX, getVaultSwitchTx } = useAppSDK()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId()
  const [waitingForTx, setWaitingForTx] = useState<`0x${string}`>()
  const [approvalType, setApprovalType] = useState<EarnAllowanceTypes>('deposit')
  const [txStatus, setTxStatus] = useState<EarnTransactionViewStates>('idle')
  const [transactions, setTransactions] = useState<TransactionWithStatus[] | undefined>()
  const [sidebarTransactionError, setSidebarTransactionError] = useState<string>()
  const [sidebarValidationError, setSidebarValidationError] = useState<string>()
  const [selectedSwitchVault, setSelectedSwitchVault] = useState<
    `${string}-${number}` | undefined
  >()
  const [isEditingSwitchAmount, setIsEditingSwitchAmount] = useState(false)
  const isIframe = useIsIframe()

  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  const isProperChainSelected = clientChainId === vaultChainId
  const isWithdraw = sidebarTransactionType === TransactionAction.WITHDRAW
  const isDeposit = sidebarTransactionType === TransactionAction.DEPOSIT
  const isSwitch = sidebarTransactionType === TransactionAction.SWITCH

  const nextTransaction = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return undefined
    }

    return transactions.find((tx) => !tx.executed)
  }, [transactions])

  const approvalTokenSymbol = useMemo(() => {
    return nextTransaction?.type === TransactionType.Approve
      ? nextTransaction.metadata.approvalAmount.token.symbol
      : ''
  }, [nextTransaction?.metadata, nextTransaction?.type])

  const getTransactionsList = useCallback(async () => {
    // get deposit/withdraw transactions
    if ((isWithdraw || isDeposit) && ownerView && token && vaultToken && amount && user) {
      const fromToken = {
        [TransactionAction.DEPOSIT]: token,
        [TransactionAction.WITHDRAW]: vaultToken,
      }[sidebarTransactionType]
      const toToken = {
        [TransactionAction.DEPOSIT]: vaultToken,
        [TransactionAction.WITHDRAW]: token,
      }[sidebarTransactionType]

      setTxStatus('loadingTx')
      try {
        const transactionsList = await {
          [TransactionAction.DEPOSIT]: getDepositTX,
          [TransactionAction.WITHDRAW]: getWithdrawTX,
        }[sidebarTransactionType]({
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
          referralCode,
        })

        if (transactionsList.length <= 0) {
          throw new Error('Error getting the transactions list')
        }
        // Map to TransactionWithStatus and set executed to false
        setTransactions(transactionsList.map((tx) => ({ ...tx, executed: false })))
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
    if (isSwitch && ownerView && selectedSwitchVault && vaultToken && user) {
      setTxStatus('loadingTx')
      const [destinationFleetAddress] = selectedSwitchVault.split('-') // it is {vaultId}-{chainId}

      try {
        const transactionsList = await getVaultSwitchTx({
          walletAddress: Address.createFromEthereum({
            value: user.address,
          }),
          amount: TokenAmount.createFrom({
            token: vaultToken,
            amount: amount && amount.gt(0) ? amount.toString() : positionAmount?.toString() ?? '0',
          }),
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: Number(slippageConfig.slippage),
          sourceFleetAddress: vault.id,
          destinationFleetAddress,
        })

        // TS says that this is never empty, but it can be... leaving that for now
        // if (transactionsList.length === 0) {
        //   throw new Error('Error getting the transactions list')
        // }

        // Map to TransactionWithStatus and set executed to false
        setTransactions(transactionsList.map((tx) => ({ ...tx, executed: false })))
        setTxStatus('txPrepared')
      } catch (err) {
        if (err instanceof Error) {
          setSidebarTransactionError(err.message)
        } else {
          setSidebarTransactionError(errorsMap.transactionRetrievalError)
        }
      }
    }
  }, [
    isWithdraw,
    isDeposit,
    ownerView,
    token,
    vaultToken,
    amount,
    user,
    isSwitch,
    selectedSwitchVault,
    sidebarTransactionType,
    getDepositTX,
    getWithdrawTX,
    vault.id,
    vaultChainId,
    slippageConfig.slippage,
    getVaultSwitchTx,
    positionAmount,
    referralCode,
  ])

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
        getSafeTxHash(hash, supportedSDKNetwork(vault.protocol.network))
          .then((safeTransactionData) => {
            if (safeTransactionData.transactionHash) {
              setWaitingForTx(safeTransactionData.transactionHash)
            }
            if (nextTransaction) {
              setTransactions((prev) =>
                prev?.map((tx) =>
                  !tx.executed && !tx.txHash && tx.type === nextTransaction.type
                    ? { ...tx, txHash: safeTransactionData.transactionHash }
                    : tx,
                ),
              )
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error getting the safe tx hash:', err)
          })
      } else {
        setWaitingForTx(hash)
        if (nextTransaction) {
          setTransactions((prev) =>
            prev?.map((tx) =>
              !tx.executed && !tx.txHash && tx.type === nextTransaction.type
                ? { ...tx, txHash: hash }
                : tx,
            ),
          )
        }
      }
    },
    onError: (err) => {
      if (isSwitch) {
        // when switching sometimes the transaction fails due to the time between approval and switching
        // we need to refresh the transactions list then to fetch the new swap
        getTransactionsList()
      }
      // eslint-disable-next-line no-console
      console.error('Error executing the transaction:', err)

      if (err instanceof Error && err.name in errorsMap) {
        setSidebarTransactionError(errorsMap[err.name as keyof typeof errorsMap])
      } else if (
        err instanceof Error &&
        'shortMessage' in err &&
        typeof err.shortMessage === 'string'
      ) {
        setSidebarTransactionError(`${err.shortMessage}. You can try again.`)
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

  const sendSafeWalletTransaction = useCallback(
    ({
      target,
      data,
      value = 0n,
    }: {
      target: `0x${string}`
      data: `0x${string}`
      value?: bigint
    }) => {
      const safeWallet = new Safe()

      safeWallet.txs
        .send({
          txs: [
            {
              to: target,
              data,
              value: value.toString(),
            },
          ],
        })
        .then(({ safeTxHash }) => {
          setTxStatus('txInProgress')
          getSafeTxHash(safeTxHash, supportedSDKNetwork(vault.protocol.network))
            .then((safeTransactionData) => {
              if (safeTransactionData.transactionHash) {
                setWaitingForTx(safeTransactionData.transactionHash)
              }
              if (nextTransaction) {
                setTransactions((prev) =>
                  prev?.map((tx) =>
                    !tx.executed && !tx.txHash && tx.type === nextTransaction.type
                      ? { ...tx, txHash: safeTransactionData.transactionHash }
                      : tx,
                  ),
                )
              }
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error('Error getting the safe tx hash:', err)
            })
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error sending transaction (safe wallet)', err)
          setTxStatus('txError')
          setSidebarTransactionError(`${errorsMap.transactionExecutionError}`)
        })
    },
    [nextTransaction, vault.protocol.network],
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

    if (isIframe) {
      sendSafeWalletTransaction(txParams)
    } else {
      sendTransaction(txParams, resolvedOverrides)
    }
  }, [
    isIframe,
    token,
    approvalCustomValue,
    approvalType,
    nextTransaction,
    publicClient,
    sendSafeWalletTransaction,
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
    setSidebarTransactionType?.(TransactionAction.DEPOSIT)
  }, [
    backToInit,
    manualSetAmount,
    setSidebarTransactionError,
    setSidebarValidationError,
    setSidebarTransactionType,
  ])

  const sidebarSecondaryButton = useMemo(() => {
    if (txStatus === 'txSuccess' && !nextTransaction && userWalletAddress) {
      return {
        label: 'Go back',
        action: () => {
          reset()
          refreshView()
        },
      }
    }

    return undefined
  }, [nextTransaction, refreshView, reset, txStatus, userWalletAddress])

  const sidebarPrimaryButton = useMemo(() => {
    if (isEditingSwitchAmount) {
      // special case for editing the switch amount - it has its own button
      return {
        label: '',
        hidden: true,
        loading: false,
      }
    }
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
        label: capitalize(sidebarTransactionType),
        action: () => null,
        disabled: true,
        loading: false,
      }
    }

    // withdraw balance check
    if (isWithdraw && positionAmount && amount && amount.isGreaterThan(positionAmount)) {
      return {
        label: capitalize(sidebarTransactionType),
        action: () => null,
        disabled: true,
        loading: false,
      }
    }

    // we want to check that only on deposit/withdraw
    if ((!amount || amount.isZero()) && !isSwitch) {
      return {
        label: capitalize(sidebarTransactionType),
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
          [TransactionType.VaultSwitch]: 'Switch',
        }[nextTransaction.type],
        action: executeNextTransaction,
      }
    }

    // switch check
    if (isSwitch) {
      if (txStatus === 'txSuccess' && !nextTransaction && userWalletAddress) {
        return {
          label: 'Go to new position',
          action: () => {
            push(
              getVaultPositionUrl({
                network: supportedSDKNetwork(vault.protocol.network),
                vaultId: selectedSwitchVault?.split('-')[0] ?? '',
                walletAddress: userWalletAddress,
              }),
            )
          },
        }
      }

      return {
        label: `Preview ${capitalize(sidebarTransactionType)}`,
        action: getTransactionsList,
        disabled: !selectedSwitchVault,
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

    if (referralCodeError) {
      return {
        label: 'Preview',
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
    amount,
    isWithdraw,
    positionAmount,
    isSwitch,
    txStatus,
    token,
    nextTransaction,
    getTransactionsList,
    openAuthModal,
    isAuthModalOpen,
    vaultChainId,
    setChain,
    sidebarTransactionType,
    approvalTokenSymbol,
    executeNextTransaction,
    userWalletAddress,
    selectedSwitchVault,
    push,
    vault.protocol.network,
    isEditingSwitchAmount,
    referralCodeError,
  ])

  const sidebarTitle = useMemo(() => {
    // switch has slightly different title
    if (
      sidebarTransactionType === TransactionAction.SWITCH &&
      nextTransaction?.type === TransactionType.Approve
    ) {
      return 'Switch\u00A0your\u00A0position'
    }
    if (
      sidebarTransactionType === TransactionAction.SWITCH &&
      !nextTransaction &&
      txStatus === 'txSuccess'
    ) {
      return 'Position\u00A0switched!'
    }
    if (nextTransaction?.type === TransactionType.Deposit) {
      return 'Preview\u00A0deposit'
    }

    if (nextTransaction?.type === TransactionType.Withdraw) {
      return 'Preview\u00A0withdraw'
    }

    if (nextTransaction?.type === TransactionType.VaultSwitch) {
      return 'Preview\u00A0switch'
    }

    return nextTransaction?.type
      ? capitalize(nextTransaction.type)
      : capitalize(TransactionAction.DEPOSIT)
  }, [nextTransaction, sidebarTransactionType, txStatus])

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (
      txStatus === 'txSuccess' &&
      !isSendingUserOperation &&
      transactions?.every((tx) => tx.executed) && // Check if all transactions are executed
      !waitingForTx &&
      sidebarTransactionType !== TransactionAction.SWITCH
    ) {
      // we do not want to reset the sidebar on switch
      // because there is a separate success screen
      reset()
      if (userWalletAddress) {
        // refreshes the view
        refreshView()
        // revalidates users wallet data (all of fetches with wallet tagged in it)
        revalidatePositionData(
          sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
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
                  network: supportedSDKNetwork(vault.protocol.network),
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
    sidebarTransactionType,
    txStatus,
    vault,
    waitingForTx,
    userWalletAddress,
    isDeposit,
    isWithdraw,
    transactions,
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
          // if its switch and its the last transaction, we want the success screen a _LITTLE_ later
          // this is because on the next (success) screen we want to show the new position
          if (sidebarTransactionType === TransactionAction.SWITCH && !nextTransaction) {
            setTimeout(() => {
              setTxStatus('txSuccess')
            }, 3000)
          } else {
            setTxStatus('txSuccess')
          }

          // Mark the completed transaction as executed: true
          setTransactions((prevTransactions) =>
            prevTransactions?.map((tx) => {
              // Use the hash stored in waitingForTx to identify the transaction
              if (
                tx.transaction.calldata === nextTransaction?.transaction.calldata && // A way to identify the transaction, might need a better unique ID
                !tx.executed
              ) {
                return { ...tx, executed: true }
              }

              return tx
            }),
          )
          setWaitingForTx(undefined) // Clear waitingForTx after successful execution and state update
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error waiting for transaction', err)
          setTxStatus('txError')
          setSidebarTransactionError(`${errorsMap.transactionExecutionError}`)
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
    nextTransaction,
    sidebarTransactionType,
  ])

  // watch for token balance changes
  useEffect(() => {
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
    if (isSwitch) {
      if (!selectedSwitchVault) {
        setSidebarValidationError('Please select a vault to switch to')
      } else {
        setSidebarValidationError(undefined)
      }
      if (amount && positionAmount && amount.isGreaterThan(positionAmount)) {
        setSidebarValidationError(errorsMap.insufficientPositionBalanceError)
      }
      if (amount && positionAmount && !amount.isGreaterThan(positionAmount)) {
        setSidebarValidationError(undefined)
      }
    }
  }, [
    amount,
    sidebarValidationError,
    tokenBalance,
    sidebarTransactionType,
    positionAmount,
    isDeposit,
    isWithdraw,
    isSwitch,
    selectedSwitchVault,
  ])

  // refresh the transactions list when the amount changes, while is switching
  useEffect(() => {
    if (amount && amount.isGreaterThan(0) && isSwitch) {
      getTransactionsList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  return {
    manualSetAmount,
    sidebar: {
      title: sidebarTitle,
      primaryButton: sidebarPrimaryButton,
      secondaryButton: sidebarSecondaryButton,
      error: sidebarTransactionError ?? sidebarValidationError,
    },
    nextTransaction,
    vaultChainId,
    reset,
    backToInit,
    user,
    approvalTokenSymbol,
    approvalType,
    setApprovalType,
    isTransakOpen,
    setIsTransakOpen,
    setSelectedSwitchVault,
    selectedSwitchVault,
    transactions,
    txStatus,
    isEditingSwitchAmount,
    setIsEditingSwitchAmount,
    setSidebarTransactionError,
  }
}
