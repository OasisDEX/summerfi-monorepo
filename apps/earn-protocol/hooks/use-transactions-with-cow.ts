/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client'

import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import {
  getVaultPositionUrl,
  getVaultUrl,
  useEarnProtocolChain,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import {
  type SDKVaultishType,
  type SupportedNetworkIds,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, slugifyVault, supportedSDKNetwork } from '@summerfi/app-utils'
import {
  Address,
  getChainInfoByChainId,
  type IToken,
  TokenAmount,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'
import { type PublicClient } from 'viem'

import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { formatTxAmount } from '@/helpers/transaction-analytics'
import { transactionErrorsMap as errorsMap } from '@/helpers/transaction-errors'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleButtonClickEvent, useHandleTransactionEvent } from '@/hooks/use-mixpanel-event'
import { useRevalidatePositionData } from '@/hooks/use-revalidate'
import { useTransactionCore } from '@/hooks/use-transaction-core'
import { useTransactionSidebar } from '@/hooks/use-transaction-sidebar'
import { useTransactionValidation } from '@/hooks/use-transaction-validation'

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
  isDepositWithSwap: boolean
  setIsDepositWithSwap: Dispatch<SetStateAction<boolean>>
  // Called once a deposit/withdraw completes successfully.
  onTransactionSuccess?: () => void
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
  isDepositWithSwap,
  setIsDepositWithSwap,
  referralCode,
  referralCodeError,
  onTransactionSuccess,
}: UseTransactionParams) => {
  const { refresh: refreshView, push } = useRouter()
  const [slippageConfig] = useSlippageConfig()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const transactionEventHandler = useHandleTransactionEvent()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const {
    getDepositTx: getDepositTX,
    getWithdrawTx: getWithdrawTX,
    getVaultSwitchEnsoTx: getVaultSwitchTx,
    getIntentSwapsSellOrderQuote,
    getPermit2AuthorizationTx,
    isPermit2AuthorizationNeeded,
  } = useAppSDK()
  const { login, isOpen: isAuthModalOpen } = useEarnProtocolLogin()
  const [isTransakOpen, setIsTransakOpen] = useState(false)
  const { setChain, isSettingChain, chain } = useEarnProtocolChain()
  const [selectedSwitchVault, setSelectedSwitchVault] = useState<
    `${string}-${number}` | undefined
  >()
  const [isEditingSwitchAmount, setIsEditingSwitchAmount] = useState(false)
  const revalidatePositionData = useRevalidatePositionData()

  const isProperChainSelected = chain.id === vaultChainId
  const isWithdraw = sidebarTransactionType === TransactionAction.WITHDRAW
  const isDeposit = sidebarTransactionType === TransactionAction.DEPOSIT
  const isSwitch = sidebarTransactionType === TransactionAction.SWITCH

  const {
    validationError,
    clearValidationError,
    isDepositAmountOverBalance,
    isWithdrawAmountOverPosition,
  } = useTransactionValidation({
    amount,
    tokenBalance,
    positionAmount,
    isDeposit,
    isWithdraw,
    isSwitch,
    selectedSwitchVault,
    sidebarTransactionType,
  })

  // Latest getTransactionsList, so the core's send-error handler can re-fetch the
  // switch tx list without a definition cycle (getTransactionsList needs the core's
  // setters, which only exist after the core is created).
  const getTransactionsListRef = useRef<() => void>(() => undefined)
  const triggerSwitchRefresh = useCallback(() => {
    getTransactionsListRef.current()
  }, [])

  const {
    transactions,
    setTransactions,
    txStatus,
    setTxStatus,
    waitingForTx,
    nextTransaction,
    approvalTokenSymbol,
    approvalType,
    setApprovalType,
    executeNextTransaction,
    backToInit: coreBackToInit,
    sidebarTransactionError,
    setSidebarTransactionError,
    isSendingUserOperation,
  } = useTransactionCore({
    vault,
    amount,
    token,
    isDeposit,
    isWithdraw,
    isSwitch,
    sidebarTransactionType,
    publicClient,
    flow,
    approvalCustomValue,
    userWalletAddress,
    onSwitchSendError: triggerSwitchRefresh,
  })

  const getTransactionsList = useCallback(async () => {
    // get deposit/withdraw transactions
    if (
      (isDeposit || isWithdraw) &&
      ownerView &&
      token &&
      vaultToken &&
      amount &&
      userWalletAddress
    ) {
      try {
        let transactionsList: TransactionInfo[] = []

        const fromToken = {
          [TransactionAction.DEPOSIT]: token,
          [TransactionAction.WITHDRAW]: vaultToken,
        }[sidebarTransactionType] as IToken

        const toToken = {
          [TransactionAction.DEPOSIT]: vaultToken,
          [TransactionAction.WITHDRAW]: token,
        }[sidebarTransactionType] as IToken

        if (
          amount &&
          isDeposit &&
          ((toToken.symbol !== 'WETH' && fromToken.symbol !== toToken.symbol) ||
            (toToken.symbol === 'WETH' &&
              fromToken.symbol !== toToken.symbol &&
              fromToken.symbol !== 'ETH'))
        ) {
          setTxStatus('loadingTx')
          const sender = userWalletAddress as `0x${string}`
          const fromAmount = TokenAmount.createFrom({
            amount: amount.toString(),
            token: fromToken,
          })

          const orderQuote = await getIntentSwapsSellOrderQuote({
            sender,
            fromAmount,
            toToken,
            slippagePercentage: Number(slippageConfig.slippage),
          })
          const { toAmount } = orderQuote

          if (!publicClient) {
            throw new Error('Public client is required for deposit with swap')
          }

          const isPermit2AuthNeeded = await isPermit2AuthorizationNeeded({
            ownerAddress: sender,
            tokenAddress: toToken.address.toSolidityValue(),
            amount: toAmount.toSolidityValue(),
            chainId: vaultChainId,
          })

          transactionsList = isPermit2AuthNeeded
            ? await getPermit2AuthorizationTx({
                chainId: vaultChainId,
                tokenAddress: toToken.address.toSolidityValue(),
              })
            : []
          if (transactionsList.length === 0 && !isDepositWithSwap) {
            setIsDepositWithSwap(true)
            setTxStatus('idle')

            return
          }
        } else {
          setTxStatus('loadingTx')
          transactionsList = await {
            [TransactionAction.DEPOSIT]: getDepositTX,
            [TransactionAction.WITHDRAW]: getWithdrawTX,
          }[sidebarTransactionType]({
            walletAddress: Address.createFromEthereum({
              value: userWalletAddress,
            }),
            amount: TokenAmount.createFrom({
              token: fromToken,
              amount: amount.toString(),
            }),
            toToken,
            fleetAddress: vault.id,
            chainInfo: getChainInfoByChainId(vaultChainId),
            slippage: Number(slippageConfig.slippage),
            ...(isWithdraw && referralCode ? { referralCode } : {}),
          })
        }

        transactionEventHandler({
          transactionType: isWithdraw ? 'withdraw' : 'deposit',
          txAmount: formatTxAmount(amount, token),
          txEvent: 'transactionSimulated',
          vaultSlug: slugifyVault(vault),
          result: 'success',
        })

        if (transactionsList.length <= 0) {
          throw new Error('Error getting the transactions list')
        }
        // Map to TransactionWithStatus and set executed to false
        setTransactions(
          transactionsList.map((tx) => ({ ...tx, executed: false }) as TransactionWithStatus),
        )
        setTxStatus('txPrepared')
      } catch (err) {
        transactionEventHandler({
          transactionType: isWithdraw ? 'withdraw' : 'deposit',
          txEvent: 'transactionSimulated',
          txAmount: formatTxAmount(amount, token),
          vaultSlug: slugifyVault(vault),
          result: 'failure',
        })
        setSidebarTransactionError(
          err instanceof Error ? err.message : errorsMap.transactionRetrievalError,
        )
      }
    }
    // get switch transactions
    if (isSwitch && ownerView && selectedSwitchVault && vaultToken && userWalletAddress) {
      setTxStatus('loadingTx')
      const [destinationFleetAddress] = selectedSwitchVault.split('-') // it is {vaultId}-{chainId}

      try {
        const transactionsList = await getVaultSwitchTx({
          walletAddress: Address.createFromEthereum({
            value: userWalletAddress,
          }),
          amount: TokenAmount.createFrom({
            token: vaultToken,
            amount:
              amount && amount.gt(0) ? amount.toString() : (positionAmount?.toString() ?? '0'),
          }),
          chainInfo: getChainInfoByChainId(vaultChainId),
          slippage: Number(slippageConfig.slippage),
          sourceFleetAddress: vault.id,
          destinationFleetAddress,
        })

        transactionEventHandler({
          transactionType: 'vault-switch',
          txEvent: 'transactionSimulated',
          txAmount: formatTxAmount(amount, vaultToken),
          vaultSlug: slugifyVault(vault),
          result: 'success',
        })

        // Map to TransactionWithStatus and set executed to false
        setTransactions(transactionsList.map((tx) => ({ ...tx, executed: false })))
        setTxStatus('txPrepared')
      } catch (err) {
        transactionEventHandler({
          transactionType: 'vault-switch',
          txEvent: 'transactionSimulated',
          txAmount: formatTxAmount(amount, vaultToken),
          vaultSlug: slugifyVault(vault),
          result: 'failure',
        })
        setSidebarTransactionError(
          err instanceof Error ? err.message : errorsMap.transactionRetrievalError,
        )
      }
    }
  }, [
    isDeposit,
    isWithdraw,
    ownerView,
    token,
    vaultToken,
    amount,
    userWalletAddress,
    isSwitch,
    selectedSwitchVault,
    setTxStatus,
    sidebarTransactionType,
    vault,
    vaultChainId,
    slippageConfig.slippage,
    getDepositTX,
    getWithdrawTX,
    positionAmount,
    transactionEventHandler,
    setTransactions,
    setSidebarTransactionError,
    getIntentSwapsSellOrderQuote,
    publicClient,
    isPermit2AuthorizationNeeded,
    getPermit2AuthorizationTx,
    isDepositWithSwap,
    setIsDepositWithSwap,
    referralCode,
    getVaultSwitchTx,
  ])

  getTransactionsListRef.current = getTransactionsList

  const backToInit = useCallback(() => {
    setIsDepositWithSwap(false)
    coreBackToInit()
  }, [coreBackToInit, setIsDepositWithSwap])

  const reset = useCallback(() => {
    // resets everything
    backToInit()
    manualSetAmount(undefined)
    setSidebarTransactionError(undefined)
    clearValidationError()
    setSidebarTransactionType?.(TransactionAction.DEPOSIT)
    buttonClickEventHandler(`vault-${flow}-sidebar-reset`)
  }, [
    backToInit,
    buttonClickEventHandler,
    clearValidationError,
    flow,
    manualSetAmount,
    setSidebarTransactionError,
    setSidebarTransactionType,
  ])

  const {
    title: sidebarTitle,
    primaryButton: sidebarPrimaryButton,
    secondaryButton: sidebarSecondaryButton,
  } = useTransactionSidebar({
    isEditingSwitchAmount,
    userWalletAddress,
    isAuthModalOpen,
    ownerView,
    isProperChainSelected,
    isSettingChain,
    vaultChainId,
    flow,
    tokenBalanceLoading,
    tokenBalance,
    isSwitch,
    isDepositAmountOverBalance,
    isWithdrawAmountOverPosition,
    amount,
    txStatus,
    token,
    nextTransaction,
    approvalTokenSymbol,
    sidebarTransactionType,
    selectedSwitchVault,
    referralCodeError,
    isDepositWithSwap,
    vault,
    login,
    setChain,
    buttonClickEventHandler,
    setIsTransakOpen,
    getTransactionsList,
    executeNextTransaction,
    push,
    reset,
    refreshView,
  })

  // refresh data when all transactions are executed and are successful
  useEffect(() => {
    if (
      txStatus === 'txSuccess' &&
      !isSendingUserOperation &&
      transactions?.every((tx) => tx.executed) && // Check if all transactions are executed
      !waitingForTx &&
      sidebarTransactionType !== TransactionAction.SWITCH &&
      !isDepositWithSwap
    ) {
      // we do not want to reset the sidebar on switch
      // because there is a separate success screen
      reset()
      if (userWalletAddress) {
        // refreshes the view
        refreshView()
        // revalidates users wallet data (all of fetches with wallet tagged in it)
        revalidatePositionData({
          chainName: sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network)),
          vaultId: vault.id,
          walletAddress: userWalletAddress,
        })

        onTransactionSuccess?.()

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
    revalidatePositionData,
    txStatus,
    vault,
    waitingForTx,
    userWalletAddress,
    isDeposit,
    isWithdraw,
    transactions,
    isDepositWithSwap,
    onTransactionSuccess,
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
      error: sidebarTransactionError ?? validationError,
    },
    nextTransaction,
    vaultChainId,
    reset,
    backToInit,
    userWalletAddress,
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
