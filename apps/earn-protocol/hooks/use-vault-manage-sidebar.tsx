import { type ChangeEvent, type Dispatch, type SetStateAction, useMemo } from 'react'
import {
  ControlsDepositWithdraw,
  ControlsSwitch,
  type EarningsEstimationsMap,
  getDisplayToken,
  ProjectedEarningsCombined,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  SkeletonLine,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type DropdownRawOption,
  type EarnAllowanceTypes,
  type EarnAppConfigType,
  type EarnTransactionViewStates,
  type GetVaultsApyResponse,
  type NetworkIds,
  type SDKSupportedChain,
  type SDKVaultishType,
  TransactionAction,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { type IArmadaPosition, TransactionType } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'
import dynamic from 'next/dynamic'

import { PendingTransactionsList } from '@/components/molecules/PendingTransactionsList/PendingTransactionsList'

const ControlsApproval = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsApproval').then(
      (mod) => mod.ControlsApproval,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const ControlsSwitchTransactionView = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsSwitchTransactionView').then(
      (mod) => mod.ControlsSwitchTransactionView,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const ControlsSwitchSuccessErrorView = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsSwitchSuccessErrorView').then(
      (mod) => mod.ControlsSwitchSuccessErrorView,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const OrderInfoDeposit = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/OrderInfoDeposit').then(
      (mod) => mod.OrderInfoDeposit,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const OrderInfoWithdraw = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/OrderInfoWithdraw').then(
      (mod) => mod.OrderInfoWithdraw,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

type SidebarButton = {
  label: string
  action?: () => void
  hidden?: boolean
  loading?: boolean
  disabled?: boolean
}

type UseSidebarPropsType = {
  sidebarTransactionType: TransactionAction
  vaults: SDKVaultishType[]
  vault: SDKVaultishType
  vaultChainId: SDKSupportedChain
  vaultsApyByNetworkMap: GetVaultsApyResponse
  systemConfig: Partial<EarnAppConfigType>
  netValueUSD: BigNumber
  transactions?: TransactionWithStatus[]
  nextTransaction?: TransactionWithStatus
  txStatus: EarnTransactionViewStates
  selectedSwitchVault?: `${string}-${number}`
  setSidebarTransactionType: Dispatch<SetStateAction<TransactionAction>>
  setSidebarTransactionError: Dispatch<SetStateAction<string | undefined>>
  transactionSidebarData: {
    title: string
    error?: string
    primaryButton: SidebarButton
    secondaryButton?: SidebarButton
  }
  amountParsed: BigNumber
  amountDisplay: string
  approvalCustomAmount: string
  switchAmountDisplay: string
  amountDisplayUSDWithSwap: string
  transactionReset: () => void
  position: IArmadaPosition
  setSelectedSwitchVault: Dispatch<SetStateAction<`${string}-${number}` | undefined>>
  handleAmountChange: (ev: ChangeEvent<HTMLInputElement>) => void
  handleTokenSelectionChange: (option: DropdownRawOption) => void
  baseTokenOptions: DropdownOption[]
  tokenOptions: DropdownOption[]
  selectedTokenOption: DropdownOption
  onFocus: () => void
  approvalOnFocus: () => void
  switchOnFocus: () => void
  onBlur: () => void
  approvalOnBlur: () => void
  switchOnBlur: () => void
  switchResetToInitialAmount: () => void
  approvalHandleAmountChange: (ev: ChangeEvent<HTMLInputElement>) => void
  backToInit: () => void
  ownerView: boolean
  selectedTokenBalance?: BigNumber
  netValue: BigNumber
  selectedTokenBalanceLoading: boolean
  manualSetAmount: Dispatch<SetStateAction<string | undefined>>
  approvalManualSetAmount: Dispatch<SetStateAction<string | undefined>>
  switchManualSetAmount: Dispatch<SetStateAction<string | undefined>>
  transactionFee?: string
  transactionFeeLoading: boolean
  isEditingSwitchAmount: boolean
  setIsEditingSwitchAmount: Dispatch<SetStateAction<boolean>>
  approvalTokenSymbol: string
  approvalType: EarnAllowanceTypes
  setApprovalType: Dispatch<SetStateAction<EarnAllowanceTypes>>
  isDrawerOpen: boolean
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
  isMobile: boolean
  estimatedEarnings: string
  forecastSummaryMap?: EarningsEstimationsMap
  isLoadingForecast: boolean
  isMobileOrTablet: boolean
}

export const useVaultManageSidebar = ({
  sidebarTransactionType,
  vaults,
  vault,
  vaultChainId,
  vaultsApyByNetworkMap,
  systemConfig,
  netValueUSD,
  transactions,
  nextTransaction,
  txStatus,
  selectedSwitchVault,
  setSidebarTransactionType,
  setSidebarTransactionError,
  transactionSidebarData,
  amountParsed,
  amountDisplay,
  switchAmountDisplay,
  amountDisplayUSDWithSwap,
  transactionReset,
  position,
  setSelectedSwitchVault,
  handleAmountChange,
  handleTokenSelectionChange,
  baseTokenOptions,
  tokenOptions,
  selectedTokenOption,
  onFocus,
  approvalOnFocus,
  switchOnFocus,
  onBlur,
  approvalOnBlur,
  switchOnBlur,
  ownerView,
  selectedTokenBalance,
  netValue,
  selectedTokenBalanceLoading,
  manualSetAmount,
  approvalManualSetAmount,
  switchManualSetAmount,
  transactionFee,
  transactionFeeLoading,
  switchResetToInitialAmount,
  isEditingSwitchAmount,
  setIsEditingSwitchAmount,
  approvalTokenSymbol,
  approvalType,
  setApprovalType,
  approvalHandleAmountChange,
  approvalCustomAmount,
  isDrawerOpen,
  setIsDrawerOpen,
  isMobile,
  backToInit,
  estimatedEarnings,
  forecastSummaryMap,
  isLoadingForecast,
  isMobileOrTablet,
}: UseSidebarPropsType) => {
  const isSwitch = sidebarTransactionType === TransactionAction.SWITCH
  const isDeposit = sidebarTransactionType === TransactionAction.DEPOSIT
  const isWithdraw = sidebarTransactionType === TransactionAction.WITHDRAW
  const isDepositOrWithdraw = isDeposit || isWithdraw

  const potentialVaultsToSwitchTo = useMemo(() => {
    return vaults
      .filter((potentialVault) => {
        return (
          subgraphNetworkToSDKId(potentialVault.protocol.network) === vaultChainId &&
          potentialVault.id !== vault.id
        )
      })
      .sort((a, b) => {
        const vaultApyA = vaultsApyByNetworkMap[`${a.id}-${vaultChainId}`]
        const vaultApyB = vaultsApyByNetworkMap[`${b.id}-${vaultChainId}`]

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!vaultApyA || !vaultApyB) {
          return 0
        }

        return vaultApyB.apy - vaultApyA.apy
      })
  }, [vault.id, vaultChainId, vaults, vaultsApyByNetworkMap])

  const sidebarTabsList = useMemo(() => {
    return [TransactionAction.DEPOSIT, TransactionAction.WITHDRAW, TransactionAction.SWITCH].filter(
      (action) => {
        const disabledByConfig = !systemConfig.features?.VaultSwitching
        const noVaults = potentialVaultsToSwitchTo.length === 0

        if (disabledByConfig || noVaults || netValueUSD.lt(0.1)) {
          return action !== TransactionAction.SWITCH
        }

        return true
      },
    )
  }, [netValueUSD, potentialVaultsToSwitchTo.length, systemConfig.features?.VaultSwitching])

  const sidebarContentName:
    | 'ControlsSwitch'
    | 'ControlsSwitchTransactionView'
    | 'ControlsSwitchSuccessErrorView'
    | 'ControlsApproval'
    | 'OrderInfoDeposit'
    | 'ControlsDepositWithdraw'
    | 'OrderInfoWithdraw'
    | `Transaction (${string}) not supported` = useMemo(() => {
    // TODO: this hook needs a rework after vault switching is done
    // trying to make this simple - if there is no next transaction, we are in the entry points
    // also adding a fail safe for the mapping missing here at the end
    if (!nextTransaction) {
      if (isSwitch) {
        if (txStatus === 'txSuccess' && selectedSwitchVault) {
          // a success screen specially for the switch action
          return 'ControlsSwitchSuccessErrorView' as const
        }

        return 'ControlsSwitch'
      } else if (isDepositOrWithdraw) {
        return 'ControlsDepositWithdraw' as const
      }

      return `Transaction (undefined) not supported` as const
    }
    if (isSwitch && selectedSwitchVault) {
      return 'ControlsSwitchTransactionView' as const
    }
    if (nextTransaction.type === TransactionType.Approve) {
      return 'ControlsApproval' as const
    } else if (nextTransaction.type === TransactionType.Deposit) {
      return 'OrderInfoDeposit' as const
    } else if (nextTransaction.type === TransactionType.Withdraw) {
      return 'OrderInfoWithdraw' as const
    } else {
      // this is a fail safe for the mapping missing here at the end
      // we should never get here
      return `Transaction (${nextTransaction.type}) not supported` as const
    }
  }, [nextTransaction, isSwitch, selectedSwitchVault, isDepositOrWithdraw, txStatus])

  const sidebarTitleTabs = useMemo(() => {
    if (!nextTransaction) {
      if (isSwitch && txStatus === 'txSuccess') {
        return undefined
      }

      return sidebarTabsList
    }

    return undefined
  }, [nextTransaction, sidebarTabsList, isSwitch, txStatus])

  const sidebarTitle = useMemo(() => {
    if (!nextTransaction) {
      if (isSwitch && txStatus === 'txSuccess') {
        return transactionSidebarData.title
      }

      return sidebarTransactionType
    }

    return transactionSidebarData.title
  }, [isSwitch, nextTransaction, transactionSidebarData.title, sidebarTransactionType, txStatus])

  const sidebarProps: SidebarProps = useMemo(() => {
    return {
      title: sidebarTitle,
      titleTabs: sidebarTitleTabs,
      onTitleTabChange: (action) => {
        setSidebarTransactionType(action as TransactionAction)
        setSidebarTransactionError(undefined)
        if (amountParsed.gt(0)) {
          transactionReset()
        }
      },
      content: (
        <>
          {sidebarContentName === 'ControlsSwitchSuccessErrorView' && selectedSwitchVault ? (
            <ControlsSwitchSuccessErrorView
              currentVault={vault}
              selectedSwitchVault={selectedSwitchVault}
              vaultsList={potentialVaultsToSwitchTo}
              transactions={transactions}
              chainId={vaultChainId as unknown as NetworkIds}
            />
          ) : null}
          {sidebarContentName === 'ControlsSwitch' ? (
            <ControlsSwitch
              currentPosition={position}
              currentVault={vault}
              potentialVaults={potentialVaultsToSwitchTo}
              chainId={vaultChainId as unknown as NetworkIds}
              vaultsApyByNetworkMap={vaultsApyByNetworkMap}
              selectVault={setSelectedSwitchVault}
              selectedVault={selectedSwitchVault}
            />
          ) : null}
          {sidebarContentName === 'ControlsDepositWithdraw' ? (
            <ControlsDepositWithdraw
              amountDisplay={amountDisplay}
              amountDisplayUSD={amountDisplayUSDWithSwap}
              handleAmountChange={handleAmountChange}
              handleDropdownChange={handleTokenSelectionChange}
              transactionType={sidebarTransactionType}
              options={
                sidebarTransactionType === TransactionAction.WITHDRAW
                  ? baseTokenOptions
                  : tokenOptions
              }
              dropdownValue={selectedTokenOption}
              onFocus={onFocus}
              onBlur={onBlur}
              ownerView={ownerView}
              tokenSymbol={
                sidebarTransactionType === TransactionAction.DEPOSIT
                  ? selectedTokenOption.value
                  : getDisplayToken(vault.inputToken.symbol)
              }
              tokenBalance={
                sidebarTransactionType === TransactionAction.DEPOSIT
                  ? selectedTokenBalance
                  : ownerView
                    ? netValue
                    : undefined
              }
              tokenBalanceLoading={selectedTokenBalanceLoading}
              manualSetAmount={manualSetAmount}
            />
          ) : null}
          {sidebarContentName === 'ControlsSwitchTransactionView' && selectedSwitchVault ? (
            <ControlsSwitchTransactionView
              currentVault={vault}
              currentVaultNetValue={netValue}
              vaultsList={potentialVaultsToSwitchTo}
              selectedSwitchVault={selectedSwitchVault}
              vaultsApyByNetworkMap={vaultsApyByNetworkMap}
              transactions={transactions}
              switchingAmount={switchAmountDisplay}
              setSwitchingAmount={switchManualSetAmount}
              isLoading={transactionSidebarData.primaryButton.loading}
              switchingAmountOnBlur={switchOnBlur}
              switchingAmountOnFocus={switchOnFocus}
              transactionFee={transactionFee}
              transactionFeeLoading={transactionFeeLoading}
              resetToInitialAmount={switchResetToInitialAmount}
              isEditingSwitchAmount={isEditingSwitchAmount}
              setIsEditingSwitchAmount={setIsEditingSwitchAmount}
            />
          ) : null}
          {sidebarContentName === 'ControlsApproval' ? (
            <ControlsApproval
              tokenSymbol={approvalTokenSymbol}
              approvalType={approvalType}
              setApprovalType={setApprovalType}
              setApprovalCustomValue={approvalHandleAmountChange}
              approvalCustomValue={approvalCustomAmount}
              customApprovalManualSetAmount={approvalManualSetAmount}
              customApprovalOnBlur={approvalOnBlur}
              customApprovalOnFocus={approvalOnFocus}
              tokenBalance={selectedTokenBalance}
            />
          ) : null}
          {sidebarContentName === 'OrderInfoDeposit' && nextTransaction ? (
            <OrderInfoDeposit
              chainId={vaultChainId}
              transaction={nextTransaction}
              amountParsed={amountParsed}
              amountDisplayUSD={amountDisplayUSDWithSwap}
              transactionFee={transactionFee}
              transactionFeeLoading={transactionFeeLoading}
            />
          ) : null}
          {sidebarContentName === 'OrderInfoWithdraw' && nextTransaction ? (
            <OrderInfoWithdraw
              chainId={vaultChainId}
              transaction={nextTransaction}
              amountParsed={amountParsed}
              amountDisplayUSD={amountDisplayUSDWithSwap}
              transactionFee={transactionFee}
              transactionFeeLoading={transactionFeeLoading}
            />
          ) : null}
          <PendingTransactionsList transactions={transactions} chainId={vaultChainId} />
        </>
      ),
      customHeader:
        !isDrawerOpen && isMobile ? (
          <SidebarMobileHeader
            type="manage"
            sidebarTransactionType={sidebarTransactionType}
            setSidebarTransactionType={setSidebarTransactionType}
          />
        ) : undefined,
      handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
      goBackAction: nextTransaction?.type ? backToInit : undefined,
      primaryButton: transactionSidebarData.primaryButton,
      secondaryButton: transactionSidebarData.secondaryButton,
      footnote: (
        <>
          {!nextTransaction?.type ? (
            <ProjectedEarningsCombined
              vault={vault}
              amountDisplay={amountDisplay}
              estimatedEarnings={estimatedEarnings}
              forecastSummaryMap={forecastSummaryMap}
              isLoadingForecast={isLoadingForecast}
              ownerView={ownerView}
            />
          ) : null}
          <SidebarFootnote
            title={sidebarFootnote.title}
            list={sidebarFootnote.list}
            tooltip={sidebarFootnote.tooltip}
          />
        </>
      ),
      error: transactionSidebarData.error,
      isMobileOrTablet,
    }
  }, [
    amountDisplay,
    amountDisplayUSDWithSwap,
    amountParsed,
    approvalCustomAmount,
    approvalHandleAmountChange,
    approvalManualSetAmount,
    approvalOnBlur,
    approvalOnFocus,
    approvalTokenSymbol,
    approvalType,
    backToInit,
    baseTokenOptions,
    estimatedEarnings,
    forecastSummaryMap,
    handleAmountChange,
    handleTokenSelectionChange,
    isDrawerOpen,
    isEditingSwitchAmount,
    isLoadingForecast,
    isMobile,
    isMobileOrTablet,
    manualSetAmount,
    netValue,
    nextTransaction,
    onBlur,
    onFocus,
    ownerView,
    position,
    potentialVaultsToSwitchTo,
    selectedSwitchVault,
    selectedTokenBalance,
    selectedTokenBalanceLoading,
    selectedTokenOption,
    setApprovalType,
    setIsDrawerOpen,
    setIsEditingSwitchAmount,
    setSelectedSwitchVault,
    setSidebarTransactionError,
    setSidebarTransactionType,
    sidebarContentName,
    sidebarTitle,
    sidebarTitleTabs,
    sidebarTransactionType,
    switchAmountDisplay,
    switchManualSetAmount,
    switchOnBlur,
    switchOnFocus,
    switchResetToInitialAmount,
    tokenOptions,
    transactionFee,
    transactionFeeLoading,
    transactionReset,
    transactionSidebarData.error,
    transactionSidebarData.primaryButton,
    transactionSidebarData.secondaryButton,
    transactions,
    vault,
    vaultChainId,
    vaultsApyByNetworkMap,
  ])

  return {
    sidebarProps,
    sidebarTitle,
    sidebarTabsList,
  }
}
