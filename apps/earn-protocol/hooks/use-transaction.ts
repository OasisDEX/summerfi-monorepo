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
} from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, slugifyVault, supportedSDKNetwork } from '@summerfi/app-utils'
import { type IToken } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'
import { type PublicClient } from 'viem'

import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { buildDepositWithdrawTransactions } from '@/helpers/build-deposit-withdraw-txs'
import { buildSwitchTransactions } from '@/helpers/build-switch-txs'
import { formatTxAmount } from '@/helpers/transaction-analytics'
import { transactionErrorsMap as errorsMap } from '@/helpers/transaction-errors'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useHandleButtonClickEvent, useHandleTransactionEvent } from '@/hooks/use-mixpanel-event'
import { useRevalidatePositionData } from '@/hooks/use-revalidate'
import { useRwaSDK } from '@/hooks/use-rwa-sdk'
import { useTransactionCore } from '@/hooks/use-transaction-core'
import { useTransactionSidebar } from '@/hooks/use-transaction-sidebar'
import { useTransactionValidation } from '@/hooks/use-transaction-validation'

type UseTransactionParams = {
  vault: SDKVaultishType
  vaultChainId: SupportedNetworkIds
  // RWA vaults are rounds-based: deposits/withdrawals are routed through the
  // dedicated RWA SDK handlers instead of the standard ERC-4626 flow.
  isRwaVault?: boolean
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
  // Called once a deposit/withdraw completes successfully. RWA views use it to refresh the
  // client-side pending receipts, which the server-side revalidation does not cover.
  onTransactionSuccess?: () => void
}

export const useTransaction = ({
  vault,
  vaultChainId,
  isRwaVault = false,
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
  onTransactionSuccess,
}: UseTransactionParams) => {
  const { refresh: refreshView, push } = useRouter()
  const [slippageConfig] = useSlippageConfig()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const transactionEventHandler = useHandleTransactionEvent()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { getDepositTx: getDepositTX, getWithdrawTx: getWithdrawTX, getVaultSwitchTx } = useAppSDK()
  // RWA tx builders live only on the institutional SDK surface.
  const { getRwaDepositTx: getRwaDepositTX, getRwaWithdrawTx: getRwaWithdrawTX } = useRwaSDK()
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
    backToInit,
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
      (isWithdraw || isDeposit) &&
      ownerView &&
      token &&
      vaultToken &&
      amount &&
      userWalletAddress
    ) {
      setTxStatus('loadingTx')
      try {
        const transactionsList = await buildDepositWithdrawTransactions({
          action: sidebarTransactionType as TransactionAction.DEPOSIT | TransactionAction.WITHDRAW,
          isRwaVault,
          token,
          vaultToken,
          amount,
          userWalletAddress,
          fleetAddress: vault.id,
          vaultChainId,
          slippage: Number(slippageConfig.slippage),
          referralCode,
          getDepositTx: getDepositTX,
          getWithdrawTx: getWithdrawTX,
          getRwaDepositTx: getRwaDepositTX,
          getRwaWithdrawTx: getRwaWithdrawTX,
        })

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
        setTransactions(transactionsList)
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
      try {
        const transactionsList = await buildSwitchTransactions({
          selectedSwitchVault,
          vaultToken,
          amount,
          positionAmount,
          userWalletAddress,
          sourceFleetAddress: vault.id,
          vaultChainId,
          slippage: Number(slippageConfig.slippage),
          getVaultSwitchTx,
        })

        transactionEventHandler({
          transactionType: 'vault-switch',
          txEvent: 'transactionSimulated',
          txAmount: formatTxAmount(amount, vaultToken),
          vaultSlug: slugifyVault(vault),
          result: 'success',
        })

        setTransactions(transactionsList)
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
    isWithdraw,
    isDeposit,
    ownerView,
    token,
    vaultToken,
    amount,
    userWalletAddress,
    isSwitch,
    selectedSwitchVault,
    sidebarTransactionType,
    isRwaVault,
    getDepositTX,
    getWithdrawTX,
    getRwaDepositTX,
    getRwaWithdrawTX,
    vault,
    vaultChainId,
    slippageConfig.slippage,
    referralCode,
    transactionEventHandler,
    getVaultSwitchTx,
    positionAmount,
    setTransactions,
    setTxStatus,
    setSidebarTransactionError,
  ])

  getTransactionsListRef.current = getTransactionsList

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
      sidebarTransactionType !== TransactionAction.SWITCH
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

        // lets RWA views reload their client-side pending receipts (server revalidation above only
        // covers server-fetched data, not the on-chain receipt balances read via the RWA SDK).
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
